import {LoginSecurity} from "../../../models/login-security.model";
import {UserPhone} from "../../../models/login-security.model";

import * as loginSecurityAction from "../../accounts/login-security/logi-security-action";
export let accountLogin!: LoginSecurity;
export let accountloginPhone!: UserPhone;

export function loginSecurityReducer(loginState: LoginSecurity = accountLogin,
    action: loginSecurityAction.loginTypesActions): any {
        switch (action.type) {
            case loginSecurityAction.UPDATE_LOGIN:
                let newDataLogin = {...loginState,...action.payload}
                return newDataLogin;

                case loginSecurityAction.GET_USER_DATA:
                    return {...action.payload}
                      
                    
        }
      
}


