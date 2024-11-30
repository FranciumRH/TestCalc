import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseCrmComponent } from './warehouse-crm.component';

describe('WarehouseCrmComponent', () => {
  let component: WarehouseCrmComponent;
  let fixture: ComponentFixture<WarehouseCrmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseCrmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseCrmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
