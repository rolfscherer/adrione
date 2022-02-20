export interface AuthenticationRequest {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthenticationResponse {
  token: string;
}
