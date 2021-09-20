import { Account } from './account';
export interface ApplicationUser {
  token: string;
  user: Account;
}
export interface FunctionSystem {
  name: string;
  url: string;
  functionCode: string;
  childrens: Action[];
}
export interface Action {
  id: number;
  url: string;
  code: string;
}
