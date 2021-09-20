export interface AttitudeScore {
  id: number;
  period: number;
  point: number;
  periodTypeId: number;
  accountId: number;
  scoreBy: number;
  scoreType: string;
  createdTime: string;
  modifiedTime: string | null;
}
