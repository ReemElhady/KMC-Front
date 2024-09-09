export interface LoginSecurity {
  name: string
  phone: string
  email: string

}
export interface UserToken {
  exp: number
  id: number
  jti: string
  name: string
  phone: string
  email: string
  token_type: string
  user_id: number
}
export interface UserPhone {
  code: string
  phone: string

}
