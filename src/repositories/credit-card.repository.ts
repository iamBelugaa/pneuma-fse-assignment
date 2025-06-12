/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from '@/generated/prisma';
import { ICreateCreditCardData } from '@/types/card';

export class CreditCardRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(
    options: {
      archived?: boolean;
      includeTransferRatios?: boolean;
    } = {}
  ) {
    const where: any = {};
    where.archived = options.archived ?? false;

    const include = options.includeTransferRatios
      ? {
          transferRatios: {
            where: { archived: false },
            include: {
              program: {
                select: { id: true, name: true, enabled: true },
              },
            },
          },
        }
      : undefined;

    const result = await this.prisma.creditCard.findMany({
      where,
      include,
      orderBy: [{ bankName: 'asc' }, { name: 'asc' }],
    });

    return result;
  }

  async findById(id: string) {
    return this.prisma.creditCard.findUnique({
      where: { id },
    });
  }

  async create(data: ICreateCreditCardData) {
    return this.prisma.creditCard.create({ data });
  }

  async createMany(cards: ICreateCreditCardData[]) {
    return this.prisma.creditCard.createMany({
      data: cards,
      skipDuplicates: true,
    });
  }
}
