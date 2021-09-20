export interface Performance {
  id: number;
  objectiveId: number;
  objectiveName: string;
  month: number;
  percentage: number;
  uploadBy: number;
  createdTime: string;
  modifiedTime: string | null;
}
