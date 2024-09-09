
export interface RegisterAuthModel {
  access(access: any): unknown;
  name: string;
  email: string;
  mobile: number;
  password: string;
}

export interface TokensModel {
  access: string,
  refresh: string
}

export interface CreateAccount {
  name: string;
  email: string;
  phone: string;
  password: string;
  re_password: string;
}

export interface JWTToken {
  access(access: any): unknown;
  email: string
  exp: number
  id: number
  jti: string
  name: string
  phone: string
  token_type: string
  user_id: number
}

