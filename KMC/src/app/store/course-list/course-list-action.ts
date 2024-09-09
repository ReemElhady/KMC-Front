import { Action } from '@ngrx/store';
import { CoursesList } from 'src/app/models/course-list.model';

export const STORE_LIST = 'STORE_LIST';
export const UPDATE_COURSE = 'UPDATE_COURSE';

export class StoreListActions implements Action {
  readonly type = STORE_LIST;
  constructor(public payload: CoursesList[]) {}
}

export class UpdateListActions implements Action {
  readonly type = UPDATE_COURSE;
  constructor(public payload: CoursesList) {}
}

export type ListActionsTypes = StoreListActions | UpdateListActions;
