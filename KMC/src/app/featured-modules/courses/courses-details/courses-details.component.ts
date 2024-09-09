import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { HttpService, imgUrl } from 'src/app/@shared/http/http.service';
import { CoursesList } from 'src/app/models/course-list.model';
import { UpdateListActions } from 'src/app/store/course-list/course-list-action';

@Component({
  selector: 'app-courses-details',
  templateUrl: './courses-details.component.html',
  styleUrls: ['./courses-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CoursesDetailsComponent implements OnInit, OnDestroy {
  imgUrl = imgUrl;
  isLoading = false;
  private unSubscribe!: Subscription;
  courseContent!: CoursesList;
  slug!: string;
  id!: number;
  constructor(
    private store: Store<{ courseDetails: CoursesList[] }>,
    private aRoute: ActivatedRoute,
    private httpService: HttpService
  ) { }

  ngOnInit(): void {
    this.aRoute.params.subscribe((value) => {
      this.id = value['id'];
      this.store.select('courseDetails').subscribe((courses) => {
        if (!courses) this.sendCourseDetails();
        else {
          let course = courses.filter((val) => val.id == this.id);
          if (!course.length) this.sendCourseDetails();
          else {
            this.courseContent = course[0];
          }
        }
      });
    });
  }
  ngOnDestroy(): void {
    if (this.unSubscribe) {
      this.unSubscribe.unsubscribe();
    }
  }
  sendCourseDetails() {
    this.isLoading = true;
    this.httpService
      .getReq(`api/courses/details/${this.id}`)
      .subscribe((res: CoursesList) => {
        this.store.dispatch(new UpdateListActions(res));
        this.isLoading = false;
      });
  }
}
