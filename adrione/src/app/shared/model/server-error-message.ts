export interface ServerErrorMessage {
  path: string;
  code: string;
  message: string;
}

export interface ServerError {
  code: string;
  message: string;
  errors: ServerErrorMessage[];
}
