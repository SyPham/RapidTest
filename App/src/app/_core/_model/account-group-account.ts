import { AccountGroup } from './account.group';
import { Account } from 'src/app/_core/_model/account';
export interface AccountGroupAccount {
  id: number;
  accountGroupId: number;
  accountId: number;
  account: Account;
  accountGroup: AccountGroup;
}
