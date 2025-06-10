export interface IBaseEntity {
  id: string;
  createdAt: Date;
  modifiedAt: Date;
}

export interface FormState {
  error?: string;
  success?: boolean;
  isLoading: boolean;
}
