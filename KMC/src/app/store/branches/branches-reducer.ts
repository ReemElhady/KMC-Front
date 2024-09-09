import { CourseBranchId, CourseBranch } from 'src/app/models/branch.model';
import * as branchActions from './branches-action';

export let branch!: CourseBranch[];
export let branchId!: CourseBranchId;

export function branchReducer(
  Branch: CourseBranch[] = branch,
  action: branchActions.BranchActionsTypes
): any {
  switch (action.type) {
    case branchActions.STORE_BRANCH:
      if (!Branch) return [...action.payload];
      else return [...Branch, ...action.payload];
    default:
      return Branch;
  }
}
