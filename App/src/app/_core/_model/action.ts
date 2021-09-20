export interface Action {
  id: number;
  target: string;
  content: string;
  deadline: any;
  accountId: number;
  kPIId: number;
  statusId: number;
  createdTime: string;
  modifiedTime: string | null;
}
