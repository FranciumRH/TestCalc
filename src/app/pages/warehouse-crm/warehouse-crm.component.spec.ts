import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WarehouseCrmComponent } from './warehouse-crm.component';
import { PalletCapacityCalculationComponent } from '../../components/pallet-capacity-calculation/pallet-capacity-calculation.component';
import { ExcelImportComponent } from '../../components/excel-import/excel-import.component';
import { CommonModule } from '@angular/common';

describe('WarehouseCrmComponent', () => {
  let component: WarehouseCrmComponent;
  let fixture: ComponentFixture<WarehouseCrmComponent>;
  let palletCapacityComponent: PalletCapacityCalculationComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, ExcelImportComponent, PalletCapacityCalculationComponent],
      declarations: [WarehouseCrmComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WarehouseCrmComponent);
    component = fixture.componentInstance;

    // Mock дочерний компонент
    palletCapacityComponent = TestBed.createComponent(PalletCapacityCalculationComponent).componentInstance;

    // Связываем ViewChild вручную
    component.palletCapacityComponent = palletCapacityComponent;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update totalData and call calculatePalletsFromItems on child component', () => {
    const mockData = [{ quantity: '10', reserved: '5', available: '5' }];

    spyOn(palletCapacityComponent, 'calculatePalletsFromItems');

    component.onTotalDataUpdated(mockData);

    expect(component.totalData).toEqual(mockData);
    expect(palletCapacityComponent.calculatePalletsFromItems).toHaveBeenCalledWith(mockData);
  });

  it('should bind PalletCapacityCalculationComponent using @ViewChild', () => {
    fixture.detectChanges();

    expect(component.palletCapacityComponent).toBeTruthy();
    expect(component.palletCapacityComponent).toEqual(palletCapacityComponent);
  });
});
