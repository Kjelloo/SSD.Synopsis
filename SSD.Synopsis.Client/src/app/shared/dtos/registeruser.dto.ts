export interface RegisterUserDto {
  username: string;
  password: string | undefined;
  salt: string | undefined;
  publicKey: string | undefined;
}
