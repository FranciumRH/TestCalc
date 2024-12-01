import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import * as XLSX from 'xlsx';
import { ExcelService } from '../../services/excelService/excel.service';
import { ServerDataService } from '../../services/dataService/data.service';

@Component({
  selector: 'app-excel-import',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './excel-import.component.html',
  styleUrls: ['./excel-import.component.scss']
})
export class ExcelImportComponent {
  @Output() totalDataUpdated = new EventEmitter<any>();

  constructor(private excelService: ExcelService, private serverDataService: ServerDataService) { }

  async onFileChange(event: any): Promise<void> {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e: any) => {
        const jsonData = this.excelService.parseFileToJson(e.target.result);

        // Очищаем серверные данные
        await this.serverDataService.clearServerData();

        // Группируем данные
        const { polikarpovaData, pollyData, totalData } = this.excelService.extractGroupedData(jsonData);

        // Отправляем данные на сервер
        this.serverDataService.sendData('save-data', { polikarpovaData, pollyData, totalData });

        // Обновляем totalData
        this.totalDataUpdated.emit(totalData);
      };
      reader.readAsArrayBuffer(file);
      event.target.value = '';
    }
  }
}