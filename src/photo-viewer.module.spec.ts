import { PhotoViewerModule } from './photo-viewer.module';

describe('PhotoViewerModule', () => {
  let photoViewerModule: PhotoViewerModule;

  beforeEach(() => {
    photoViewerModule = new PhotoViewerModule();
  });

  it('should create an instance', () => {
    expect(photoViewerModule).toBeTruthy();
  });
});
