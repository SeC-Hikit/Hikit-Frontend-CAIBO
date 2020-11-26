import { TestBed } from '@angular/core/testing';

import { TrailServiceService } from './trail-service.service';

describe('TrailServiceService', () => {
  let service: TrailServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrailServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
