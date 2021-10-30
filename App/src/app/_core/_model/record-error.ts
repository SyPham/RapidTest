export interface RecordError {
  id: number;
  employeeId: number;
  lastCheckInDateTime: string | null;
  lastCheckOutDateTime: string | null;
  station: string;
  content: string;
  createdTime: string;
}
