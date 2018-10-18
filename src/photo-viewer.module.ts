import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { PhotoViewerComponent } from './photo-viewer/photo-viewer.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [PhotoViewerComponent],
    exports: [PhotoViewerComponent]
})
export class PhotoViewerModule {
}
