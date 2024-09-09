import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseComponent } from './course/course.component';
import { CoursesCategoriesComponent } from './courses-categories/courses-categories.component';
import { CoursesDetailsComponent } from './courses-details/courses-details.component';
import { CoursesListComponent } from './courses-list/courses-list.component';

const routes: Routes = [
  // {
  //   path: '',
  //   component: CourseComponent,
  // },
  {
    path: '',
    component: CoursesListComponent,
  },
  {
    path: 'categories/:typeId',
    component: CoursesCategoriesComponent,
  },
  // {
  //   path: 'list/:typeId',
  //   component: CoursesListComponent,
  // },
  {
    path: 'details/:id',
    component: CoursesDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoursesRoutingModule {}
