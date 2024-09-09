import { Action } from "@ngrx/store";
import {Points} from '../../../models/points.model';
export const POINTS = 'POINTS'
export class PointsAction implements Action {
    readonly type = POINTS
    constructor(public payload: Points) { }
  }