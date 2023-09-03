export interface IUserType {
  id: string;
  name: string;
  description: string;
}

export interface IUser {
  username: string;
  email: string;
  password: string;
  type: IUserType;
  loggedIn: boolean;
  token?: string;
  firstName?: string;
  lastName?: string;
}

export interface IUnitUser extends IUser {
  id: string;
}

export interface IUsers {
  [key: string]: IUnitUser;
}
