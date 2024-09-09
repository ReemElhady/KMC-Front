import {Points} from '../../../models/points.model';
import * as pointsAction from "../../accounts/points/points-action";
export let points!: Points;

export function pointsReducer(pointsState: Points = points,
    action: pointsAction.PointsAction): any {
    switch (action.type) {
      case pointsAction.POINTS:
     
        return {
            ...action.payload
          }  
          default:
            return pointsState
        }
      
         }