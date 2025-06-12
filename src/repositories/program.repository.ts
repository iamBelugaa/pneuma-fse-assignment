import { PrismaClient } from '@/generated/prisma';
import {
  CreateProgramInput,
  ProgramQueryInput,
  UpdateProgramInput,
} from '@/lib/schemas';
import { PaginationMeta } from '@/types/response';

export class ProgramRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(input: ProgramQueryInput, userId: string) {
    const { page, pageSize } = input;

    const [result, total] = await Promise.all([
      this.prisma.frequentFlyerProgram.findMany({
        where: { archived: false, createdById: userId },
        orderBy: { createdAt: 'desc' },
        take: pageSize,
        skip: page * pageSize,
        select: {
          id: true,
          name: true,
          enabled: true,
          archived: true,
          assetName: true,
          createdAt: true,
          modifiedAt: true,
          createdBy: { select: { id: true, email: true } },
          modifiedBy: { select: { id: true, email: true } },
          transferRatios: {
            where: { archived: false },
            select: { id: true, ratio: true, creditCard: true, archived: true },
          },
        },
      }),
      this.prisma.frequentFlyerProgram.count({
        where: { archived: false, createdById: userId },
      }),
    ]);

    const totalPages = Math.ceil(total / pageSize);
    const pagination: PaginationMeta = { page, total, pageSize, totalPages };
    return { programs: result, pagination };
  }

  async findById(id: string, userId: string) {
    return this.prisma.frequentFlyerProgram.findFirst({
      where: { id, archived: false, createdById: userId },
      select: {
        id: true,
        name: true,
        assetName: true,
        enabled: true,
        archived: true,
        createdAt: true,
        modifiedAt: true,
        createdBy: { select: { id: true, email: true } },
        modifiedBy: { select: { id: true, email: true } },
        transferRatios: {
          where: { archived: false },
          select: {
            id: true,
            ratio: true,
            creditCard: {
              select: {
                id: true,
                name: true,
                bankName: true,
              },
            },
          },
        },
      },
    });
  }

  async create(data: CreateProgramInput, userId: string) {
    const { transferRatios, ...programData } = data;

    return this.prisma.$transaction(async (tx) => {
      const program = await tx.frequentFlyerProgram.create({
        select: { id: true },
        data: { ...programData, createdById: userId, modifiedById: userId },
      });

      if (transferRatios && transferRatios.length > 0) {
        await tx.transferRatio.createMany({
          data: transferRatios.map((ratio) => ({
            programId: program.id,
            creditCardId: ratio.creditCardId ?? '',
            ratio: ratio.ratio,
            createdById: userId,
            modifiedById: userId,
          })),
          skipDuplicates: true,
        });
      }

      return tx.frequentFlyerProgram.findUnique({
        where: { id: program.id },
        select: {
          id: true,
          name: true,
          assetName: true,
          enabled: true,
          archived: true,
          createdAt: true,
          modifiedAt: true,
          createdBy: { select: { id: true, email: true } },
          modifiedBy: { select: { id: true, email: true } },
          transferRatios: {
            where: { archived: false },
            select: {
              id: true,
              ratio: true,
              creditCard: {
                select: {
                  id: true,
                  name: true,
                  bankName: true,
                },
              },
            },
          },
        },
      });
    });
  }

  async update(id: string, data: UpdateProgramInput, userId: string) {
    const { transferRatios, ...programData } = data;

    return this.prisma.$transaction(async (tx) => {
      const existingProgram = await tx.frequentFlyerProgram.findFirst({
        where: { id, archived: false, createdById: userId },
        select: { id: true },
      });

      if (!existingProgram) {
        throw new Error('Program not found or access denied');
      }

      await tx.frequentFlyerProgram.update({
        where: { id },
        data: { ...programData, modifiedById: userId },
        select: { id: true },
      });

      if (transferRatios) {
        const existingRatios = await tx.transferRatio.findMany({
          where: { programId: id, archived: false },
          select: { id: true, creditCardId: true },
        });

        const newCreditCardIds = transferRatios.map((r) => r.creditCardId);
        const ratiosToArchive = existingRatios.filter(
          (r) => !newCreditCardIds.includes(r.creditCardId)
        );

        if (ratiosToArchive.length > 0) {
          await tx.transferRatio.updateMany({
            where: { id: { in: ratiosToArchive.map((r) => r.id) } },
            data: { archived: true, modifiedById: userId },
          });
        }

        if (transferRatios.length > 0) {
          await Promise.all(
            transferRatios.map((ratio) =>
              tx.transferRatio.upsert({
                where: {
                  programId_creditCardId: {
                    programId: id,
                    creditCardId: ratio.creditCardId ?? '',
                  },
                },
                create: {
                  programId: id,
                  creditCardId: ratio.creditCardId ?? '',
                  ratio: ratio.ratio,
                  createdById: userId,
                  modifiedById: userId,
                },
                update: {
                  ratio: ratio.ratio,
                  modifiedById: userId,
                  archived: false,
                },
              })
            )
          );
        }
      }

      return tx.frequentFlyerProgram.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          assetName: true,
          enabled: true,
          archived: true,
          createdAt: true,
          modifiedAt: true,
          createdBy: { select: { id: true, email: true } },
          modifiedBy: { select: { id: true, email: true } },
          transferRatios: {
            where: { archived: false },
            select: {
              id: true,
              ratio: true,
              creditCard: {
                select: {
                  id: true,
                  name: true,
                  bankName: true,
                },
              },
            },
          },
        },
      });
    });
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const existingProgram = await tx.frequentFlyerProgram.findFirst({
        where: { id, archived: false, createdById: userId },
        select: { id: true },
      });

      if (!existingProgram) {
        throw new Error('Program not found or access denied');
      }

      await Promise.all([
        tx.transferRatio.updateMany({
          where: { programId: id, archived: false },
          data: { archived: true, modifiedById: userId },
        }),
        tx.frequentFlyerProgram.update({
          where: { id },
          data: { archived: true, modifiedById: userId },
          select: { id: true },
        }),
      ]);
    });
  }

  async toggleEnabled(id: string, enabled: boolean, userId: string) {
    const existingProgram = await this.prisma.frequentFlyerProgram.findFirst({
      where: { id, archived: false, createdById: userId },
      select: { id: true },
    });

    if (!existingProgram) {
      throw new Error('Program not found or access denied');
    }

    return this.prisma.frequentFlyerProgram.update({
      where: { id },
      data: { enabled, modifiedById: userId },
      select: {
        id: true,
        name: true,
        enabled: true,
        archived: true,
        assetName: true,
        createdAt: true,
        modifiedAt: true,
        createdBy: { select: { id: true, email: true } },
        modifiedBy: { select: { id: true, email: true } },
        transferRatios: {
          where: { archived: false },
          select: {
            id: true,
            ratio: true,
            creditCard: { select: { id: true, name: true, bankName: true } },
          },
        },
      },
    });
  }

  async getStats(userId: string): Promise<{
    total: number;
    enabled: number;
    disabled: number;
    withTransferRatios: number;
  }> {
    const stats = await this.prisma.frequentFlyerProgram.aggregate({
      where: { archived: false, createdById: userId },
      _count: { id: true, enabled: true },
    });

    const [enabledCount, withRatiosCount] = await Promise.all([
      this.prisma.frequentFlyerProgram.count({
        where: { enabled: true, archived: false, createdById: userId },
      }),
      this.prisma.frequentFlyerProgram.count({
        where: {
          archived: false,
          createdById: userId,
          transferRatios: { some: { archived: false } },
        },
      }),
    ]);

    const total = stats._count.id || 0;
    return {
      total,
      enabled: enabledCount,
      disabled: total - enabledCount,
      withTransferRatios: withRatiosCount,
    };
  }
}
