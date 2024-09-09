import { Course } from '../../models/course-model';
import * as courseAction from './courses-action';

export let course!: Course[];

export function courseReducer(
  coursenState: Course[] = course,
  action: courseAction.StoreCourseAction
): any {
  switch (action.type) {
    case courseAction.course:
      return {
        ...action.payload,
      };

    default:
      return coursenState;
  }
}
