import { IBaseEntity } from '.';
import { ICreditCard } from './card';

export interface ITransferRatio extends IBaseEntity {
  id: string;
  ratio: number;
  archived: boolean;
  creditCard?: ICreditCard;
}
