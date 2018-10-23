import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { PhotoViewerComponent } from './photo-viewer/photo-viewer.component';
import { SwiperModule } from 'ngx-swiper-wrapper';

@NgModule({
    imports: [
        CommonModule,
        SwiperModule,
    ],
    providers: [],
    declarations: [PhotoViewerComponent],
    exports: [PhotoViewerComponent]
})
export class PhotoViewerModule {
}
