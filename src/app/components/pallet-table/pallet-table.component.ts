import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DetailedResult, TotalData } from '../../models/server-data.model';
import { PalletCalculationService } from '../../services/pallet-service/pallet-calculation.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pallet-table',
  imports: [CommonModule],
  templateUrl: './pallet-table.component.html',
  styleUrl: './pallet-table.component.scss'
})
export class PalletTableComponent implements OnChanges {
  @Input() detailedResults: DetailedResult[] = []; // Данные для отображения в таблице

  constructor() {}

  // Метод для копирования текста в буфер обмена
  copyToClipboard(value: string): void {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(value).then(() => {
        console.log('Скопировано в буфер обмена: ', value);
      }).catch(err => {
        console.error('Ошибка копирования: ', err);
      });
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = value;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  }

  // Метод ngOnChanges для логирования изменений входных данных
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['detailedResults']) {
      console.log('Изменения в detailedResults:', changes['detailedResults']);
      console.log('Текущие данные detailedResults:', this.detailedResults);
    }
  }
}