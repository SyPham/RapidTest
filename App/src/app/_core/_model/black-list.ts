export interface BlackList {
  id: number;
  employeeId: number;
  department: string;
  code: string;
  fullName: string;
  createdBy: number;
  modifiedBy: number | null;
  deletedBy: number | null;
  deletedTime: string | null;
  createdTime: string;
  modifiedTime: string | null;
  firstWorkDate: any;
  systemDateTime: any;
}
