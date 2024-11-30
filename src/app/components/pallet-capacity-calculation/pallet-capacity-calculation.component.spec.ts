import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PalletCapacityCalculationComponent } from './pallet-capacity-calculation.component';

describe('PalletCapacityCalculationComponent', () => {
  let component: PalletCapacityCalculationComponent;
  let fixture: ComponentFixture<PalletCapacityCalculationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PalletCapacityCalculationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PalletCapacityCalculationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
