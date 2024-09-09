import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoursesRoutingModule } from './courses-routing.module';
import { CoursesListComponent } from './courses-list/courses-list.component';
import { CoursesDetailsComponent } from './courses-details/courses-details.component';
import { CourseComponent } from './course/course.component';
import { CoursesCategoriesComponent } from './courses-categories/courses-categories.component';
import { SharedModule } from 'src/app/@shared/shared.module';
import { SafePipeModule } from 'safe-pipe';


@NgModule({
  declarations: [
    CoursesListComponent,
    CoursesDetailsComponent,
    CourseComponent,
    CoursesCategoriesComponent
  ],
  imports: [
    CommonModule,
    CoursesRoutingModule,
    SharedModule,
    SafePipeModule

  ]
})
export class CoursesModule { }
