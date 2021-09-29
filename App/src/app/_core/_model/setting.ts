export interface Setting {
  id: number;
  day: number;
  mins: number;
  createdBy: number;
  settingType: string;
  modifiedBy: number | null;
  createdTime: string;
  modifiedTime: string | null;
}
