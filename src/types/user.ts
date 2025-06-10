import { IBaseEntity } from '.';

export interface IUser extends IBaseEntity {
  email: string;
  name?: string;
}

export interface IAuthUserRequest {
  email: string;
  password: string;
}

export interface ISessionUser {
  id: string;
  email: string;
}

export interface IExtendedSession {
  expires: string;
  user: ISessionUser;
}
