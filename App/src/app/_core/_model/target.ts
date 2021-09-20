export interface Target {
  id: number;
  value: number;
  performance: number;
  yTD: number;
  kPIId: number;
  createdBy: number;
  submitted: boolean;
  targetTime: string;
  modifiedTime: string | null;
  createdTime: string;
}
