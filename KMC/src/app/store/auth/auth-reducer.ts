import { TokensModel } from "src/app/models/auth-models";
import * as tokensActions from "./auth-action";
import { CookieService } from "ngx-cookie-service";
let cs = new CookieService(document,null) ;

export let tokens!:TokensModel|undefined ;
if(cs.get("token"))
tokens = {
  access:cs.get("token") ,
  refresh :"dlfjseiopgjo"
}



export function tokenReducer (tokenState:TokensModel|undefined =tokens,action:tokensActions.TokenActionsTypes):any {
  switch(action.type){
    case tokensActions.STROE_TOKEN:
      return {
        ...action.payload
      }
    case tokensActions.UPDATE_TOKEN:
      return {
        ...tokenState,
        ...action.payload
      }
    default :
      return tokenState
  }

}
