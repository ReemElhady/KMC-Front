import { Action } from '@ngrx/store';
import { CourseBranch } from 'src/app/models/branch.model';

export const STORE_BRANCH = 'STORE_BRANCH';

export class StoreBranchActions implements Action {
  readonly type = STORE_BRANCH;
  constructor(public payload: CourseBranch[]) {}
}

export type BranchActionsTypes = StoreBranchActions;
