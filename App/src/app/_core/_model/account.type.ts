import { Account } from "./account";

export interface AccountType {
  id: number;
  name: string;
  code: string;
  accounts: Account[];
}
