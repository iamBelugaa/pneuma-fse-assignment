import { IBaseEntity } from '.';
import { ICreditCard } from './card';
import { IFrequentFlyerProgram } from './program';
import { IUser } from './user';

export interface ITransferRatio extends IBaseEntity {
  programId: string;
  creditCardId: string;
  ratio: number;
  archived: boolean;
  createdById: string;
  modifiedById: string;
  program?: IFrequentFlyerProgram;
  creditCard?: ICreditCard;
  createdBy?: IUser;
  modifiedBy?: IUser;
}

export interface ICreateTransferRatioRequest {
  programId: string;
  creditCardId: string;
  ratio: number;
}

export interface IUpdateTransferRatioRequest {
  ratio?: number;
  archived?: boolean;
}
