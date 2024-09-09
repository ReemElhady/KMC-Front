import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { HttpService } from 'src/app/@shared/http/http.service';
import { CourseBranch } from 'src/app/models/branch.model';
import { StoreBranchActions } from 'src/app/store/branches/branches-action';

@Component({
  selector: 'app-courses-categories',
  templateUrl: './courses-categories.component.html',
  styleUrls: ['./courses-categories.component.scss'],
})
export class CoursesCategoriesComponent implements OnInit, OnDestroy {
  typeId!: string;
  branches!: any;
  branchesToDisplay: any;
  branchSubscription!: Subscription;
  isLoading: boolean = false;
  //branchIdSubscription!: Subscription;
  constructor(
    private router: ActivatedRoute,
    private store: Store<{ branches: CourseBranch }>,
    private httpService: HttpService
  ) { }

  ngOnInit(): void {
    this.router.params.subscribe((params) => {
      this.typeId = params['typeId'];
    });
    this.branchSubscription = this.store
      .select('branches')
      .subscribe((branches) => {
        this.branches = branches;
        this.branchesToDisplay = this.getBranchesData();
        if (!this.isTypeExists()) {
          this.sendBranchRequest();
        }
      });
  }
  sendBranchRequest() {
    this.isLoading = true;
    this.httpService.getReq(`api/courses/branch/${this.typeId}`).subscribe(
      (res) => {
        this.isLoading = false;

        if (res.length) this.store.dispatch(new StoreBranchActions(res));
        else this.branchesToDisplay = [];
      },
      (error) => { }
    );
  }
  ngOnDestroy(): void {
    //if (this.branchIdSubscription) {
    //  this.branchIdSubscription.unsubscribe();
    //}
    if (this.branchSubscription) {
      this.branchSubscription.unsubscribe();
    }
  }
  isTypeExists(): any {
    if (!this.branches) return false;
    else {
      let isExists = false;
      for (let i = 0; i < this.branches.length; i++) {
        if (this.branches[i].type == this.typeId) {
          isExists = true;
          break;
        }
      }
      return isExists;
    }
  }
  getBranchesData() {
    if (this.branches) {
      let branches = this.branches.filter(
        (val: { type: string }) => val.type == this.typeId
      );
      return branches;
    }
    return [];
  }
}
