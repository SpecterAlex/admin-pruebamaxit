export interface IResponse<T> {
  statusTransaction: boolean;
  statusCode: number;
  transactionMessage: string;
  exceptionMessage: string;
  data: T;
  totalRecords: number;
}
export interface ILogin {
  accessToken: IAccessToken;
  user: IUser;
}
export interface IAccessToken {
  token: string;
  expiresAt: string | Date;
}
export interface IEmployee {
  employeeId: string;
  firstName: string;
  lastName: string;
  birthDate: Date | string;
  employeeNumber: string;
  curp: string;
  ssn: string;
  phoneNumber: string;
  beneficiaries?: IBeneficiary[];
  countryId: string;
  country?: ICountry;
  creatAt: Date;
  fullName?: string;
}
export interface ICountry{
  countryId: string;
  iso: string;
  name: string;
}
export interface IUser {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  createdAt?: Date;
  fullName?: string;
}
export interface IBeneficiary {
  beneficiaryId: string;
  firstName: string;
  lastName: string;
  birthDate: Date | string;
  curp: string;
  ssn: string;
  phoneNumber: string;
  countryId: string;
  employeeId: string;
  participationPercent: number;
  country?: ICountry;
  creatAt?: Date;
  fullName?: string;
}

export interface IModule {
  id: string;
  showInMenu: boolean;
  isActive: boolean;
  title: string;
  routerLink: string;
}