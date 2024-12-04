import { TestBed } from '@angular/core/testing';

import { PalletCalculationService } from './pallet-calculation.service';

describe('PalletCalculationService', () => {
  let service: PalletCalculationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PalletCalculationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
