import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter, OnChanges, OnDestroy } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ServerDataService } from '../../services/dataService/data.service';

@Component({
  selector: 'app-pallet-capacity-calculation',
  standalone: true, // Это Standalone компонент
  imports: [CommonModule, HttpClientModule], // Здесь импортируем HttpClientModule
  templateUrl: './pallet-capacity-calculation.component.html',
  styleUrls: ['./pallet-capacity-calculation.component.scss']
})

export class PalletCapacityCalculationComponent implements OnInit, OnChanges, OnDestroy {
  @Input() totalData: any[] = [];
  totalPallets = 700;
  occupiedPallets = 0;
  occupancyPercentage = 0;
  occupancyColor = 'green';

  private updateInterval: any;

  constructor(private serverDataService: ServerDataService) {}

  ngOnInit(): void {
    this.updatePalletMetrics();
    this.startAutoUpdate();
  }

  ngOnChanges(): void {
    this.updatePalletMetrics();
  }

  ngOnDestroy(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }

  private async updatePalletMetrics(): Promise<void> {
    const totalData = await this.serverDataService.fetchData('get-total');
    this.calculatePalletsFromItems(totalData);
  }

  calculatePalletsFromItems(items: any[]): void {
    let totalPalletsNeeded = 0;

    items.forEach((item) => {
      const quantity = parseInt(item.quantity, 10);
      if (!isNaN(quantity)) {
        totalPalletsNeeded += quantity / 3 / 80;
      }
    });

    this.occupiedPallets = Math.round(totalPalletsNeeded);
    this.updateOccupancy();
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
    this.updateInterval = setInterval(() => {
      this.updatePalletMetrics();
    }, 15000);
  }
}