import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ExcelImportComponent } from '../../components/excel-import/excel-import.component';
import { PalletCapacityCalculationComponent } from '../../components/pallet-capacity-calculation/pallet-capacity-calculation.component';
import { CommonModule } from '@angular/common';
import { TotalData } from '../../models/server-data.model';
import { PalletTableComponent } from "../../components/pallet-table/pallet-table.component";


@Component({
  selector: 'app-warehouse-crm',
  imports: [CommonModule, ExcelImportComponent, PalletCapacityCalculationComponent, PalletTableComponent],
  templateUrl: './warehouse-crm.component.html',
  styleUrls: ['./warehouse-crm.component.scss']
})

export class WarehouseCrmComponent implements AfterViewInit {
  @ViewChild(PalletCapacityCalculationComponent) palletCapacityComponent!: PalletCapacityCalculationComponent; 
  @ViewChild(PalletTableComponent) palletTableComponent!: PalletTableComponent;
  totalData: TotalData[] = [];

  onTotalDataUpdated(updatedTotalData: TotalData[]): void {
    this.totalData = updatedTotalData;
    console.log('Обновленные данные totalData:', this.totalData);

    // Передача данных дочернему компоненту PalletCapacityCalculationComponent
    if (this.palletCapacityComponent) {
      this.palletCapacityComponent.totalData = updatedTotalData;
      this.palletCapacityComponent.ngOnChanges(); // Обновляем расчеты в компоненте
    }
  }

  ngAfterViewInit(): void {
    console.log('ViewChild palletCapacityComponent:', this.palletCapacityComponent);
  }
}