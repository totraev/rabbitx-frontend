export type Response<D> = {
  succes: boolean;
  error: string;
  result: D;
};

export type AuthData = {
  jwt: string;
  refreshToken: string;
  randomSecret: string;
  profile: unknown;
}

export type AuthRes = Response<AuthData[]>;