import { TestBed } from '@angular/core/testing';

import { MaintenanceServiceService } from './maintenance-service.service';

describe('MaintenanceServiceService', () => {
  let service: MaintenanceServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaintenanceServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
