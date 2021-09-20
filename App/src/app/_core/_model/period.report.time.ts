import { Period } from "./period";

export interface PeriodReportTime {
  id: number;
  periodId: number;
  reportTime: string;
  createdBy: number;
  modifiedBy: number | null;
  createdTime: string;
  modifiedTime: string | null;
  period: Period;
}
