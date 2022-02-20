export interface SessionStatus {
  loggedIn: boolean;
  roles: string[];
}

export const INIT_SESSION_STATE: SessionStatus = {
  loggedIn: false,
  roles: []
};
