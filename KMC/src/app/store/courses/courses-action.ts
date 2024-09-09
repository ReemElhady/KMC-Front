import { Action } from '@ngrx/store';
import { Course } from 'src/app/models/course-model';

export const course = 'Course';

export class StoreCourseAction implements Action {
  readonly type = course;
  constructor(public payload: Course) {}
}
