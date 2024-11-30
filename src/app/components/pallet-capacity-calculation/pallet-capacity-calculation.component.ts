import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pallet-capacity-calculation',
  imports: [FormsModule, CommonModule],
  templateUrl: './pallet-capacity-calculation.component.html',
  styleUrl: './pallet-capacity-calculation.component.scss'
})
export class PalletCapacityCalculationComponent {
  totalPallets: number = 700;
  occupiedPallets: number = 0;
  occupancyPercentage: number = 0;
  occupancyColor: string = 'green';
  inputPallets: number = 0;
  action: string = 'add';  // 'add' или 'remove' для выбора действия (добавить или убрать)

  constructor() {
    // Загружаем данные из Local Storage, если они есть
    const savedOccupiedPallets = localStorage.getItem('occupiedPallets');
    if (savedOccupiedPallets) {
      this.occupiedPallets = parseInt(savedOccupiedPallets, 10);
      this.updateOccupancy();
    }
  }

  changePallets(): void {
    if (this.action === 'add') {
      this.addPallets(this.inputPallets);
    } else if (this.action === 'remove') {
      this.removePallets(this.inputPallets);
    }
  }

  addPallets(palletsToAdd: number): void {
    if (this.occupiedPallets + palletsToAdd <= this.totalPallets) {
      this.occupiedPallets += palletsToAdd;
      this.updateOccupancy();
      localStorage.setItem('occupiedPallets', this.occupiedPallets.toString());
    }
  }

  removePallets(palletsToRemove: number): void {
    if (this.occupiedPallets - palletsToRemove >= 0) {
      this.occupiedPallets -= palletsToRemove;
      this.updateOccupancy();
      localStorage.setItem('occupiedPallets', this.occupiedPallets.toString());
    }
  }

  updateOccupancy(): void {
    this.occupancyPercentage = (this.occupiedPallets / this.totalPallets) * 100;

    // Обновляем класс для прогресс-бара в зависимости от занятости
    if (this.occupancyPercentage <= 25) {
      this.occupancyColor = 'green';
    } else if (this.occupancyPercentage <= 50) {
      this.occupancyColor = 'yellow';
    } else if (this.occupancyPercentage <= 75) {
      this.occupancyColor = 'orange';
    } else {
      this.occupancyColor = 'red';
    }
  }
}