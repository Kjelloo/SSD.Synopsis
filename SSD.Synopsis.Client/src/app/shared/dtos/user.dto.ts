export interface User {
  guid: string | undefined;
  username: string;
  token: string | undefined;
  publicKey: string | undefined;
  privateKey: string | undefined;
  salt: string | undefined;
}
