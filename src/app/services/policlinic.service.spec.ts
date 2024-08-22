import { TestBed } from '@angular/core/testing';

import { PoliclinicService } from './policlinic.service';

describe('PoliclinicService', () => {
  let service: PoliclinicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PoliclinicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
