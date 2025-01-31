import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryComponent } from './gallery/gallery.component';
import { GalleryRoutingModule } from './gallery-routing.module';
import { GalleryItemComponent } from './gallery-item/gallery-item.component';
@NgModule({
  declarations: [GalleryComponent, GalleryItemComponent],
  imports: [
    CommonModule,
    GalleryRoutingModule
  ],
})
export class GalleryModule {}
