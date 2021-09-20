import { HttpStatusCode } from "../enum/http.statuscode.enum";

export interface OperationResult {
  statusCode: HttpStatusCode;
  message: string;
  success: boolean;
  data: any;
}
