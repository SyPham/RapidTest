import { AccountGroup } from "./account.group";
import { Period } from "./period";

export interface AccountGroupPeriod {
  id: number;
  accountGroupId: number;
  periodId: number;
  accountGroup: AccountGroup;
  period: Period;
}
