import prisma from '@/lib/prisma';
import { CreditCardRepository } from './credit-card.repository';
import { ProgramRepository } from './program.repository';
import { TransferRatioRepository } from './transfer-ratio.repository';

export const programRepository = new ProgramRepository(prisma);
export const creditCardRepository = new CreditCardRepository(prisma);
export const transferRatioRepository = new TransferRatioRepository(prisma);
