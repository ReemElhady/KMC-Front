import { Home } from '../../models/home.model';
import * as homeAction from "./home-action";
export let home:Home;

export function homeReducer(homeState: Home = home,
    action: homeAction.HomeAction): any {
    switch (action.type) {
      case homeAction.HOME:
        return {
          ...action.payload
        }
  
      default:
        return homeState
    }
  
  }
  