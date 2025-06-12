import {
  creditCardRepository,
  programRepository,
  transferRatioRepository,
} from '@/repositories';
import { CreditCardService } from './credit-card.service';
import { ProgramService } from './program.service';
import { TransferRatioService } from './transfer-ratio.service';
import { UploadService } from './upload.service';

let uploadServiceInstance: UploadService | null = null;
let programServiceInstance: ProgramService | null = null;
let creditCardServiceInstance: CreditCardService | null = null;
let transferRatioServiceInstance: TransferRatioService | null = null;

export const getUploadServiceInstance = () => {
  if (!uploadServiceInstance) {
    uploadServiceInstance = new UploadService();
  }
  return uploadServiceInstance;
};

export const getCreditCardServiceInstance = () => {
  if (!creditCardServiceInstance) {
    creditCardServiceInstance = new CreditCardService(creditCardRepository);
  }
  return creditCardServiceInstance;
};

export const getProgramServiceInstance = () => {
  if (!programServiceInstance) {
    programServiceInstance = new ProgramService(programRepository);
  }
  return programServiceInstance;
};

export const getTransferRatioServiceInstance = () => {
  if (!transferRatioServiceInstance) {
    transferRatioServiceInstance = new TransferRatioService(
      transferRatioRepository
    );
  }
  return transferRatioServiceInstance;
};

export const uploadService = getUploadServiceInstance();
export const programService = getProgramServiceInstance();
export const creditCardService = getCreditCardServiceInstance();
export const transferRatioService = getTransferRatioServiceInstance();
