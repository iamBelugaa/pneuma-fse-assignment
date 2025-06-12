import prisma from '@/lib/prisma';
import { CreditCardRepository } from './credit-card.repository';
import { ProgramRepository } from './program.repository';
import { TransferRatioRepository } from './transfer-ratio.repository';

let programRepositoryInstance: ProgramRepository | null = null;
let creditCardRepositoryInstance: CreditCardRepository | null = null;
let transferRatioRepositoryInstance: TransferRatioRepository | null = null;

export const getProgramRepository = (): ProgramRepository => {
  if (!programRepositoryInstance) {
    programRepositoryInstance = new ProgramRepository(prisma);
  }
  return programRepositoryInstance;
};

export const getCreditCardRepository = (): CreditCardRepository => {
  if (!creditCardRepositoryInstance) {
    creditCardRepositoryInstance = new CreditCardRepository(prisma);
  }
  return creditCardRepositoryInstance;
};

export const getTransferRatioRepository = (): TransferRatioRepository => {
  if (!transferRatioRepositoryInstance) {
    transferRatioRepositoryInstance = new TransferRatioRepository(prisma);
  }
  return transferRatioRepositoryInstance;
};

export const programRepository = getProgramRepository();
export const creditCardRepository = getCreditCardRepository();
export const transferRatioRepository = getTransferRatioRepository();
