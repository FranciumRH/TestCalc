import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PalletVizualizerComponent } from './pallet-vizualizer.component';

describe('PalletVizualizerComponent', () => {
  let component: PalletVizualizerComponent;
  let fixture: ComponentFixture<PalletVizualizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PalletVizualizerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PalletVizualizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
