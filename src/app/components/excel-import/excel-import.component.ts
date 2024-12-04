import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import * as XLSX from 'xlsx';
import { ExcelService } from '../../services/excelService/excel.service';
import { ServerDataService } from '../../services/dataService/data.service';
import { TotalData } from '../../models/server-data.model';
import { NotificationService } from '../../services/notificationservice/notification.service';

interface ParsedData {
  polikarpovaData: any[];
  pollyData: any[];
  totalData: any[];
}

@Component({
  selector: 'app-excel-import',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './excel-import.component.html',
  styleUrls: ['./excel-import.component.scss']
})
export class ExcelImportComponent {
  @Output() totalDataUpdated = new EventEmitter<TotalData[]>(); // Указываем тип

  constructor(
    private excelService: ExcelService,
    private serverDataService: ServerDataService,
    private notificationService: NotificationService
  ) { }

  async onFileChange(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    try {
      const jsonData = await this.readExcelFile(file);
      const groupedData = this.excelService.extractGroupedData(jsonData);

      await this.processData(groupedData.totalData);

      this.totalDataUpdated.emit(groupedData.totalData);

      // Вызов функции для уведомления об успехе
      this.notifySuccess('Файл успешно загружен на сервер!');
    } catch (error) {
      console.error('Ошибка обработки файла Excel:', error);

      // Вызов функции для уведомления об ошибке
      this.notifyError('Ошибка загрузки файла на сервер.');
    } finally {
      input.value = '';
    }
  }

  // Чтение и парсинг Excel файла
  private async readExcelFile(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        try {
          const data = e.target?.result;
          if (data instanceof ArrayBuffer) {
            const jsonData = this.excelService.parseFileToJson(data);
            resolve(jsonData);
          } else {
            throw new Error('Ошибка: данные файла не являются ArrayBuffer.');
          }
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (e) => reject(new Error('Ошибка чтения файла.'));
      reader.readAsArrayBuffer(file);
    });
  }

  // Очистка сервера и отправка данных
  private async processData(totalData: TotalData[]): Promise<void> {
    try {
      console.log('Очищаем серверные данные...');
      await this.serverDataService.clearServerData();

      console.log('Отправляем данные на сервер:', totalData);
      await this.serverDataService.sendData('save-data', totalData);

      // Вызываем функцию уведомления об успешной обработке
      this.notifySuccess('Данные успешно сохранены на сервере.');
    } catch (error) {
      console.error('Ошибка при обработке данных:', error);

      // Вызываем функцию уведомления об ошибке
      this.notifyError('Не удалось сохранить данные на сервер.');
      throw error; // Прокидываем ошибку, если требуется
    }
  }
  
  private notifySuccess(message: string): void {
    this.notificationService.showSuccess(message);
  }
  private notifyError(message: string): void {
    this.notificationService.showError(message);
  }
}