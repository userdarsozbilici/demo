import { TestBed } from '@angular/core/testing';

import { MedicineServiceTsService } from './medicine.service.ts.service';

describe('MedicineServiceTsService', () => {
  let service: MedicineServiceTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedicineServiceTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
