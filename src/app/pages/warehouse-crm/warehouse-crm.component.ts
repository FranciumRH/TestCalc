import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ExcelImportComponent } from '../../components/excel-import/excel-import.component';
import { PalletCapacityCalculationComponent } from '../../components/pallet-capacity-calculation/pallet-capacity-calculation.component';
import { CommonModule } from '@angular/common';
import { TotalData } from '../../models/server-data.model';


@Component({
  selector: 'app-warehouse-crm',
  imports: [CommonModule, ExcelImportComponent, PalletCapacityCalculationComponent, ],
  templateUrl: './warehouse-crm.component.html',
  styleUrl: './warehouse-crm.component.scss'
})
export class WarehouseCrmComponent implements AfterViewInit {
  @ViewChild(PalletCapacityCalculationComponent) palletCapacityComponent!: PalletCapacityCalculationComponent;
  totalData: TotalData[] = [];

  // Обновление данных через событие
  onTotalDataUpdated(updatedTotalData: TotalData[]): void {
    this.totalData = updatedTotalData;
    console.log('Обновленные данные totalData:', this.totalData);

    // Передача данных дочернему компоненту
    if (this.palletCapacityComponent) {
      this.palletCapacityComponent.totalData = updatedTotalData;
    }
  }

  ngAfterViewInit(): void {
    console.log('ViewChild palletCapacityComponent:', this.palletCapacityComponent);
  }
}
