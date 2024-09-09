import { CoursesList } from 'src/app/models/course-list.model';
import * as listActions from './course-list-action';

export let list!: CoursesList[];

export function listReducer(
  List: CoursesList[] = list,
  action: listActions.ListActionsTypes
): any {
  switch (action.type) {
    case listActions.STORE_LIST:
      return [...action.payload];
    default:
      return List;
  }
}
export function CourseDetailsReducer(
  CourseDetails: CoursesList[] = list,
  action: listActions.ListActionsTypes
): any {
  switch (action.type) {
    case listActions.UPDATE_COURSE:
      if (CourseDetails) return [...CourseDetails, { ...action.payload }];
      return [{ ...action.payload }];
    default:
      return CourseDetails;
  }
}
