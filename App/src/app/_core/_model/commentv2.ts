export interface Comment {
  id: number;
  content: string;
  commentTypeId: string;
  createdBy: number;
  accountId: number;
  periodTypeId: number;
  period: number;
  modifiedBy: number | null;
  createdTime: string;
  scoreType: string;
  modifiedTime: string | null;
}
