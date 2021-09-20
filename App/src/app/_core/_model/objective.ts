import { Account } from "./account";

export interface Objective {
  id: number;
  topic: string;
  status: boolean;
  accountId: number;
  createdBy: number;
  modifiedBy: number | null;
  createdTime: string;
  date: string;
  modifiedTime: string | null;
  account: Account;
  accounts: string;
  accountIdList: number[];

}

export interface ObjectiveRequest {
  id: number;
  topic: string;
  status: boolean;
  date: string;
  accountIdList: number[];
}

