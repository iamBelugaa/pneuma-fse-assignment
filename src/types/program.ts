import { IBaseEntity } from '.';
import { ITransferRatio } from './ratio';
import { IUser } from './user';

export interface IFrequentFlyerProgram extends IBaseEntity {
  name: string;
  assetName?: string;
  enabled: boolean;
  archived: boolean;
  createdById: string;
  modifiedById: string;
  createdBy?: IUser;
  modifiedBy?: IUser;
  transferRatios?: ITransferRatio[];
}

export interface ICreateProgramRequest {
  name: string;
  assetName?: string;
  enabled?: boolean;
}

export interface IUpdateProgramRequest {
  name?: string;
  assetName?: string;
  enabled?: boolean;
  archived?: boolean;
}

export interface IProgramQueryParams {
  page?: number;
  pageSize?: number;
  enabled?: boolean;
  archived?: boolean;
  search?: string;
  sortBy?: 'name' | 'createdAt' | 'modifiedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface IProgramTableProps {
  isLoading?: boolean;
  programs: IFrequentFlyerProgram[];
  onDelete: (programId: string) => void;
  onEdit: (program: IFrequentFlyerProgram) => void;
  onToggleEnabled: (programId: string, enabled: boolean) => void;
}

export interface IProgramFormProps {
  program?: IFrequentFlyerProgram;
  onSubmit: (
    data: ICreateProgramRequest | IUpdateProgramRequest
  ) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}
