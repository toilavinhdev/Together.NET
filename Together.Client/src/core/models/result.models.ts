export interface IResult<T = any> {
  success: boolean;
  statusCode: number;
  message?: string;
  errors?: IResultError[];
  data: T;
}

export interface IResultError {
  code: string;
  detail?: string;
  parameter?: string;
}
