import { IBaseEntity } from '.';
import { ITransferRatio } from './ratio';

export interface ICreditCard extends IBaseEntity {
  name: string;
  bankName: string;
  archived: boolean;
  transferRatios?: ITransferRatio[];
}

export interface ICreateCreditCardData {
  name: string;
  bankName: string;
}
