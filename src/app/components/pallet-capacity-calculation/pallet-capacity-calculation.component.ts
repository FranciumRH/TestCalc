import { Component, OnInit, OnChanges, OnDestroy, Input } from '@angular/core';
import { ServerDataService } from '../../services/dataService/data.service';
import { PalletCalculationService } from '../../services/pallet-service/pallet-calculation.service';
import { TotalData } from '../../models/server-data.model';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

export interface PalletMetrics {
  totalPalletsNeeded: number;
  detailedResults: Array<{
    itemName: string;
    palletsUsed: number;
  }>;
}

@Component({
  selector: 'app-pallet-capacity-calculation',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './pallet-capacity-calculation.component.html',
  styleUrls: ['./pallet-capacity-calculation.component.scss']
})


export class PalletCapacityCalculationComponent implements OnInit, OnChanges, OnDestroy {
  @Input() totalData: TotalData[] = [];
  totalPallets = 700; 
  occupiedPallets = 0;
  occupancyPercentage = 0;
  occupancyColor = 'green';

  detailedResults: Array<any> = [];  // Для хранения подробных данных

  private updateInterval: ReturnType<typeof setInterval> | null = null;

  constructor(
    private serverDataService: ServerDataService,
    private palletCalculationService: PalletCalculationService
  ) {}

  ngOnInit(): void {
    this.updatePalletMetrics();
    this.startAutoUpdate();
  }

  ngOnChanges(): void {
    if (this.totalData && this.totalData.length > 0) {
      this.calculateMetrics(this.totalData);
    }
  }

  ngOnDestroy(): void {
    this.clearAutoUpdate();
  }

  private async updatePalletMetrics(): Promise<void> {
    try {
      const totalData = await this.serverDataService.fetchData('get-total');

      if (Array.isArray(totalData) && totalData.length > 0) {
        this.calculateMetrics(totalData);
      } else {
        console.warn('Нет данных для расчета паллетов.');
      }
    } catch (error) {
      console.error('Ошибка при получении данных с сервера:', error);
    }
  }

  private calculateMetrics(items: TotalData[]): void {
    if (!items || items.length === 0) {
      console.warn('Позиции для расчета паллетов отсутствуют.');
      return;
    }

    try {
      // Получаем подробные результаты с помощью нового метода
      this.detailedResults = this.palletCalculationService.getDetailedResults(items);

      // Считаем общие паллеты
      const totalPalletsNeeded = this.detailedResults.reduce((acc, item) => acc + item.palletsForItem, 0);
      this.occupiedPallets = totalPalletsNeeded;
      this.updateOccupancy();
    } catch (error) {
      console.error('Ошибка при расчете метрик паллетов:', error);
    }
  }

  private updateOccupancy(): void {
    this.occupancyPercentage = Math.round((this.occupiedPallets / this.totalPallets) * 100);
    this.occupancyColor =
      this.occupancyPercentage < 50
        ? 'green'
        : this.occupancyPercentage < 85
        ? 'orange'
        : 'red';
  }

  private startAutoUpdate(): void {
    this.clearAutoUpdate(); // Убедимся, что не создаем дублирующие таймеры

    this.updateInterval = setInterval(() => {
      this.updatePalletMetrics();
    }, 180000); // Обновление каждые 3 минуты
  }

  private clearAutoUpdate(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }
}