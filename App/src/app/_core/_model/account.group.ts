import { Account } from "./account";
import { Period } from "./period";

export interface AccountGroup {
  id: number;
  name: string;
  createdBy: number;
  modifiedBy: number;
  createdTime: string;
  position: number;
  sequence: number;
  modifiedTime: string | null;
  accounts: Account[];
  periods: Period[];
}
