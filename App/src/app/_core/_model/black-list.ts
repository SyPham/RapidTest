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
  firstWorkDate: string | null;
  systemDateTime: string;
  lastCheckInDateTime: string| null;
  lastCheckOutDateTime: string| null;
  lastAccessControlDateTime: string| null;
}
