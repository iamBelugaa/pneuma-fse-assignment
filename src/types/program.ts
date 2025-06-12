import { CreditCard, FrequentFlyerProgram } from '@/generated/prisma';
import { ITransferRatio } from './ratio';
import { ISessionUser } from './user';

export interface ITransferRatioWithCard extends ITransferRatio {
  creditCard: CreditCard;
}

export interface IProgramWithRatios
  extends Omit<FrequentFlyerProgram, 'createdById' | 'modifiedById'> {
  imageUrl?: string;
  createdBy?: ISessionUser;
  modifiedBy?: ISessionUser;
  transferRatios: ITransferRatioWithCard[];
}
