export interface Setting {
  id: number;
  day: number;
  mins: number;
  isDefault: boolean;
  createdBy: number;
  name: string;
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
