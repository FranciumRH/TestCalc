import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PalletTableComponent } from './pallet-table.component';

describe('PalletTableComponent', () => {
  let component: PalletTableComponent;
  let fixture: ComponentFixture<PalletTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PalletTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PalletTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
