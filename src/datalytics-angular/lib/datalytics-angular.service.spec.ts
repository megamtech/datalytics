import { TestBed } from '@angular/core/testing';

import { DatalyticsAngularService } from './datalytics-angular.service';

describe('DatalyticsAngularService', () => {
  let service: DatalyticsAngularService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatalyticsAngularService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
