export interface SessionStatus {
  username: string | null;
  loggedIn: boolean;
  roles: string[];
}

export const INIT_SESSION_STATE: SessionStatus = {
  username: null,
  loggedIn: false,
  roles: []
};
