import { PrismaClient } from '@/generated/prisma';
import {
  CreateTransferRatioInput,
  UpdateTransferRatioInput,
} from '@/lib/schemas';

export class TransferRatioRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string) {
    return this.prisma.transferRatio.findUnique({
      where: { id },
      include: {
        program: true,
        creditCard: true,
        createdBy: { select: { id: true, email: true } },
        modifiedBy: { select: { id: true, email: true } },
      },
    });
  }

  async create(data: CreateTransferRatioInput, userId: string) {
    return this.prisma.transferRatio.create({
      data: {
        archived: false,
        ratio: data.ratio,
        createdById: userId,
        modifiedById: userId,
        programId: data.programId ?? '',
        creditCardId: data.creditCardId ?? '',
      },
      include: {
        program: true,
        creditCard: true,
        createdBy: { select: { id: true, email: true } },
        modifiedBy: { select: { id: true, email: true } },
      },
    });
  }

  async update(id: string, data: UpdateTransferRatioInput, userId: string) {
    const updateData: Record<string, string | number | boolean | Date> = {
      modifiedById: userId,
      modifiedAt: new Date(),
    };

    if (data.ratio !== undefined) {
      updateData.ratio = data.ratio;
    }

    if (data.archived !== undefined) {
      updateData.archived = data.archived;
    }

    return this.prisma.transferRatio.update({
      where: { id },
      data: updateData,
      include: {
        creditCard: true,
        program: true,
        createdBy: { select: { id: true, email: true } },
        modifiedBy: { select: { id: true, email: true } },
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.transferRatio.update({
      where: { id },
      data: { archived: true },
    });
  }

  async archiveByProgram(programId: string, userId: string): Promise<number> {
    const result = await this.prisma.transferRatio.updateMany({
      where: { programId, archived: false },
      data: {
        archived: true,
        modifiedById: userId,
        modifiedAt: new Date(),
      },
    });

    return result.count;
  }

  async archiveByCreditCard(
    creditCardId: string,
    userId: string
  ): Promise<number> {
    const result = await this.prisma.transferRatio.updateMany({
      where: { creditCardId, archived: false },
      data: {
        archived: true,
        modifiedById: userId,
        modifiedAt: new Date(),
      },
    });

    return result.count;
  }
}
