import { AccountGroupAccount } from "./account-group-account";
import { AccountType } from "./account.type";

export interface Account {
  id: number;
  username: string;
  fullName: string;
  password: string;
  email: string;
  isLock: boolean;
  accountTypeId: number | null;
  createdBy: number;
  modifiedBy: number | null;
  createdTime: string;
  modifiedTime: string | null;
  accountType: AccountType;
  accountGroupText: string;
  accountGroupIds: number[];
  leader: number;
  manager: number;
  leaderName: string;
  managerName: string;
}
