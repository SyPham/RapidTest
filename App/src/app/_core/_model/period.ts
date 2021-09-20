export interface Period {
  id: number;
  periodTypeId: number;
  months: string;
  value: number;
  title: string;
  reportTime: string;
  modifiedBy: number | null;
  createdTime: string;
  modifiedTime: string | null;
}
