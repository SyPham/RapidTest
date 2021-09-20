import { Account } from "./account";

export interface Progress {
  id: number;
  name: string;
  accounts: Account[];
}
