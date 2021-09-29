import { TestBed } from '@angular/core/testing';

import { TrailPreviewService } from './trail-preview-service.service';

describe('TrailPreviewServiceService', () => {
  let service: TrailPreviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrailPreviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
