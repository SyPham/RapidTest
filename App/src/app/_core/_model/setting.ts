export interface Setting {
  id: number;
  day: number;
  mins: number;
  createdBy: number;
  settingType: string;
  description: string;
  modifiedBy: number | null;
  createdTime: string;
  modifiedTime: string | null;
}
export interface UpdateDescriptionRequest {
  id: number;
  description: string;
}
