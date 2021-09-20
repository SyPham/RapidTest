export interface Employee {
  id: number;
  fullName: string;
  code: string;
  factoryId: number;
  createdBy: number;
  modifiedBy: number | null;
  factoryName: string;
  createdTime: string;
  modifiedTime: string | null;
}
