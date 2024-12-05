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
  @Input() totalData: TotalData[] = [];  // Данные для расчета паллетов, передаваемые родительским компонентом
  totalPallets = 700;  // Общее количество паллетов
  occupiedPallets = 0;  // Занятые паллеты
  occupancyPercentage = 0;  // Процент заполняемости
  occupancyColor = 'green';  // Цвет для отображения заполняемости

  detailedResults: Array<any> = [];  // Для хранения подробных данных по каждой позиции

  private updateInterval: ReturnType<typeof setInterval> | null = null;  // Интервал обновления данных

  constructor(
    private serverDataService: ServerDataService,  // Сервис для получения данных с сервера
    private palletCalculationService: PalletCalculationService  // Сервис для расчета паллетов
  ) {}

  ngOnInit(): void {
    // Запускаем обновление данных при инициализации компонента
    this.updatePalletMetrics();
  }

  ngOnChanges(): void {
    // Вызываем расчет при изменении входных данных
    if (this.totalData && this.totalData.length > 0) {
      this.calculateMetrics(this.totalData);
    }
  }

  ngOnDestroy(): void {
    // Очищаем таймеры при уничтожении компонента
    this.clearAutoUpdate();
  }

  private async updatePalletMetrics(): Promise<void> {
    try {
      // Получаем актуальные данные с сервера
      const totalData = await this.serverDataService.fetchData('get-total');

      if (Array.isArray(totalData) && totalData.length > 0) {
        // Если данные есть, передаем их для расчета
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
      // Получаем подробные результаты с помощью сервиса
      this.detailedResults = this.palletCalculationService.getDetailedResults(items);

      // Считаем общее количество паллетов, которые требуются для хранения
      const totalPalletsNeeded = this.detailedResults.reduce((acc, item) => acc + item.palletsForItem, 0);
      this.occupiedPallets = totalPalletsNeeded;

      // Обновляем заполняемость паллетов
      this.updateOccupancy();
    } catch (error) {
      console.error('Ошибка при расчете метрик паллетов:', error);
    }
  }

  private updateOccupancy(): void {
    // Рассчитываем процент заполняемости
    this.occupancyPercentage = Math.round((this.occupiedPallets / this.totalPallets) * 100);
    
    // Изменяем цвет в зависимости от заполняемости
    this.occupancyColor =
      this.occupancyPercentage < 50
        ? 'green'
        : this.occupancyPercentage < 85
        ? 'orange'
        : 'red';
  }

  private startAutoUpdate(): void {
    // Очищаем старые интервалы перед созданием нового
    this.clearAutoUpdate();

    // Устанавливаем таймер на обновление данных каждую минуту (180000ms)
    this.updateInterval = setInterval(() => {
      this.updatePalletMetrics();
    }, 180000); // Обновление каждые 3 минуты
  }

  private clearAutoUpdate(): void {
    // Очищаем интервал обновления
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }
}