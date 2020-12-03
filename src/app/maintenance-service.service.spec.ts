import { TestBed } from '@angular/core/testing';

import { MaintenanceService } from './maintenance.service';

describe('MaintenanceServiceService', () => {
  let service: MaintenanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaintenanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
