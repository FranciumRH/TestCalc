import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { ExcelImportComponent } from '../../components/excel-import/excel-import.component';
import { PalletCapacityCalculationComponent } from '../../components/pallet-capacity-calculation/pallet-capacity-calculation.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-warehouse-crm',
  imports: [CommonModule, ExcelImportComponent, PalletCapacityCalculationComponent],
  templateUrl: './warehouse-crm.component.html',
  styleUrl: './warehouse-crm.component.scss'
})
export class WarehouseCrmComponent {
  @ViewChild(PalletCapacityCalculationComponent) palletCapacityComponent!: PalletCapacityCalculationComponent;
  totalData: any[] = [];

  onTotalDataUpdated(updatedTotalData: any[]): void {
    this.totalData = updatedTotalData;

    if (this.palletCapacityComponent) {
      this.palletCapacityComponent.calculatePalletsFromItems(this.totalData);
    }
  }

  ngAfterViewInit() {
    
  }
}
