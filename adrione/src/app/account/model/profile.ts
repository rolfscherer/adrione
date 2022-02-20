export interface Profile {
  id: number;

  username: string;
  firstname?: string | null;
  lastname?: string | null;
  alias?: string | null;
  email: string;
  passwordExpirationDate?: Date;
}
