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
  @Output() totalDataUpdated = new EventEmitter<TotalData[]>();  // Эмиттер для обновленных данных

  fileToUpload: File | null = null;

  constructor(
    private excelService: ExcelService,
    private serverDataService: ServerDataService,
    private notificationService: NotificationService
  ) {}

  // Срабатывает при изменении файла в input
  async onFileChange(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    this.fileToUpload = file;  // Сохраняем выбранный файл

    try {
      const jsonData = await this.excelService.parseFileToJson(file);  // Парсинг файла в JSON
      const groupedData = this.excelService.extractGroupedData(jsonData);  // Извлечение группированных данных

      // Отправка данных на сервер
      await this.processData(groupedData.totalData);

      // Эмитируем обновленные данные
      this.totalDataUpdated.emit(groupedData.totalData);

      // Уведомление об успехе
      this.notifySuccess('Файл успешно загружен и данные сохранены на сервере!');
    } catch (error) {
      console.error('Ошибка обработки файла Excel:', error);
      this.notifyError('Ошибка загрузки файла на сервер.');
    } finally {
      input.value = ''; // Очищаем input после обработки
    }
  }

  // Отправка данных на сервер
  private async processData(totalData: TotalData[]): Promise<void> {
    try {
      console.log('Очищаем серверные данные...');
      await this.serverDataService.clearServerData();  // Очищаем сервер

      console.log('Отправляем данные на сервер:', totalData);
      await this.serverDataService.sendData('save-data', totalData);  // Отправляем данные на сервер

      // Уведомление об успешной обработке
      this.notifySuccess('Данные успешно сохранены на сервере.');
    } catch (error) {
      console.error('Ошибка при обработке данных:', error);
      this.notifyError('Не удалось сохранить данные на сервер.');
      throw error;  // Прокидываем ошибку
    }
  }

  private notifySuccess(message: string): void {
    this.notificationService.showSuccess(message);  // Уведомление об успехе
  }

  private notifyError(message: string): void {
    this.notificationService.showError(message);  // Уведомление об ошибке
  }
}