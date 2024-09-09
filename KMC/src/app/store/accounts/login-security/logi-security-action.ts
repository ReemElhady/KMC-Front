import { Action } from "@ngrx/store";
import {LoginSecurity} from "../../../models/login-security.model";
import {UserPhone} from "../../../models/login-security.model";

export const UPDATE_LOGIN = 'UPDATE_LOGIN'
export const GET_USER_DATA = 'UGET_USER_DATA'

export class UpdateLoginAction implements Action{
    readonly type=  UPDATE_LOGIN
    constructor(public payload: LoginSecurity) { }
    }
    export class GetUserAction implements Action{
        readonly type= GET_USER_DATA
        constructor(public payload: LoginSecurity) { }
        }
    export  type loginTypesActions= UpdateLoginAction | GetUserAction