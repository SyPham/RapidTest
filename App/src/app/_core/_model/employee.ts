export interface Employee {
  id: number;
  fullName: string;
  department: string;
  code: string;
  factoryId: number;
  createdBy: number;
  modifiedBy: number | null;
  factoryName: string;
  seaInform: string;
  createdTime: string;
  modifiedTime: string | null;
}
