export interface Setting {
  id: number;
  day: number;
  createdBy: number;
  modifiedBy: number | null;
  createdTime: string;
  modifiedTime: string | null;
}
