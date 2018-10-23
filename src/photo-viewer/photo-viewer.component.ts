import {AfterViewInit, Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {PhotoViewerItem} from './photo-viewer-item.interface';
import {SwiperConfigInterface} from 'ngx-swiper-wrapper';

@Component({
    selector: 'app-photo-viewer',
    templateUrl: './photo-viewer.component.html',
    styleUrls: ['./photo-viewer.component.less'],
})
export class PhotoViewerComponent implements OnInit, AfterViewInit, OnDestroy {
    @Output('close') close = new EventEmitter();

    @Input() currentPhotoNumber = 0;
    @Input() images: PhotoViewerItem[] = null;

    @ViewChild('swiper') swiperComponent;

    currentPicture: PhotoViewerItem = null;
    showPreloader = true;

    inited = false;
    fullyLoaded = false;

    swiperConfig: SwiperConfigInterface = {
        direction: 'horizontal',
        slidesPerView: 'auto',
        allowTouchMove: false,
        spaceBetween: 10,
        centeredSlides: true,
        slideToClickedSlide: true
    };

    private previousPhotoNumber: number;
    private loadParts = {
        firstImageLoadedTimer: null,
        firstImageLoaded: false,
        afterViewInit: false
    };

    constructor() {
    }

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        if (event.code === 'ArrowLeft') {
            this.viewPrevious();
        }
        if (event.code === 'ArrowRight') {
            this.viewNext();
        }
        if (event.code === 'Escape') {
            this.emitClose();
        }
    }

    ngOnInit() {
        setTimeout(() => {
            this.inited = true;
        });

        if (this.images) {
            this.syncSwiper();
            this.show();
        }
    }

    ngAfterViewInit() {
        this.loadParts.afterViewInit = true;
    }

    ngOnDestroy() {
    }

    /** Handles click on swiper's slide event */
    thumbnailClickHandler(event) {
        this.currentPhotoNumber = +event.target.getAttribute('slideNumber');
        this.show();
    }

    /** Callback function to hide preloader and start showing image */
    imageLoaded(): void {
        clearTimeout(this.loadParts.firstImageLoadedTimer);

        this.loadParts.firstImageLoadedTimer = setTimeout(() => {
            if (!this.loadParts.firstImageLoaded) {
                this.loadParts.firstImageLoaded = true;
                this.setFullyLoaded();
            }
        }, 400);

        this.setPreloader(false);
    }

    show(number: number = null): void {
        if (+this.previousPhotoNumber !== +this.currentPhotoNumber) {
            this.setActive(false, this.previousPhotoNumber);
            this.updateCurrentPhotoNumber();
            this.setActive(true);
            this.setPreloader(true);
            this.activatePicture(number !== null ? number : this.currentPhotoNumber);
            this.syncSwiper();
        }
    }

    viewNext(): void {
        const next = this.currentPhotoNumber + 1;
        const lastPhotoNumber = this.getLastPhotoNumber();

        if (lastPhotoNumber) {
            if (next > lastPhotoNumber) {
                this.currentPhotoNumber = 0;
                this.show(0);
            } else {
                this.currentPhotoNumber = next;
                this.show(next);
            }
        }
    }

    viewPrevious(): void {
        const previous = this.currentPhotoNumber - 1;
        const lastPhotoNumber = this.getLastPhotoNumber();

        if (lastPhotoNumber) {
            if (previous < 0) {
                this.currentPhotoNumber = lastPhotoNumber;
                this.show(lastPhotoNumber);
            } else {
                this.currentPhotoNumber = previous;
                this.show(previous);
            }
        }
    }

    emitClose(): void {
        this.close.emit();
    }

    getThumbnail(image: PhotoViewerItem) {
        return image.thumbnail_small ? image.thumbnail_small : (image.thumbnail_medium ? image.thumbnail_medium : image.src);
    }

    /** Controls main image and preloader visibility */
    private setPreloader(visible: boolean): void {
        this.showPreloader = visible;
    }

    /** Slides current picture's swiper slide to the center and adds styles */
    private syncSwiper(number: number = null) {
        number = number !== null ? number : this.currentPhotoNumber;
        this.swiperComponent.directiveRef.setIndex(number);
    }

    /** Changes the img src value to show different picture */
    private activatePicture(number: number): void {
        this.currentPicture = this.images[number];
    }

    // Helpers
    private getLastPhotoNumber(): number {
        if (this.images) {
            return this.images.length - 1;
        }

        return -1;
    }

    private updateCurrentPhotoNumber() {
        this.previousPhotoNumber = this.currentPhotoNumber;
    }

    private setActive(value: boolean, photoNumber: number = null) {
        photoNumber = photoNumber !== null ? photoNumber : this.currentPhotoNumber;
        this.images[photoNumber].activeSlide = value;
    }

    private setFullyLoaded() {
        if (this.loadParts.firstImageLoaded &&
            this.loadParts.afterViewInit) {
            this.fullyLoaded = true;
        }
    }
}
