export interface TestKind {
  id: number;
  name: string;
  isDefault: boolean;
  createdBy: number;
  modifiedBy: number | null;
  createdTime: string;
  modifiedTime: string | null;
}
