import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { TotalData } from '../../models/server-data.model';

@Injectable({
  providedIn: 'root',
})
export class ServerDataService {
  private readonly baseUrl: string = 'http://localhost:3000'; // Базовый URL для всех запросов

  constructor(private http: HttpClient) { }

  /**
   * Очистка данных на сервере.
   */
  async clearServerData(): Promise<void> {
    try {
      await this.sendRequest<void>('clear-data', 'POST');
      console.log('Серверные данные успешно очищены.');
    } catch (error) {
      console.error('Ошибка при очистке серверных данных:', error);
    }
  }

  /**
   * Получение данных с сервера.
   * @param endpoint - конечная точка для запроса.
   * @returns Массив данных типа TotalData.
   */
  async fetchData(endpoint: string): Promise<TotalData[]> {
    try {
      const data = await this.sendRequest<TotalData[]>(endpoint);
      console.log('Полученные данные с сервера:', data);
      return data;
    } catch (error) {
      console.error('Ошибка при получении данных с сервера:', error);
      return [];
    }
  }

  /**
   * Отправка данных на сервер.
   * @param endpoint - конечная точка для запроса.
   * @param data - данные, которые нужно отправить.
   */
  async sendData(endpoint: string, data: any[]): Promise<void> {
    try {
      await this.sendRequest<void>(endpoint, 'POST', data);
      console.log('Данные успешно отправлены на сервер:', data);
    } catch (error) {
      console.error('Ошибка при отправке данных на сервер:', error);
    }
  }

  /**
   * Метод для отправки Excel файла на сервер.
   * @param endpoint - конечная точка для запроса.
   * @param file - файл, который необходимо отправить.
   */
  async sendExcelFile(endpoint: string, file: File): Promise<void> {
    try {
      const formData = new FormData();
      formData.append('file', file, file.name);
      await this.sendRequest(endpoint, 'POST', formData);
      console.log('Excel файл успешно отправлен на сервер');
    } catch (error) {
      console.error('Ошибка при отправке Excel файла на сервер:', error);
      throw error;
    }
  }

  /**
   * Утилитарный метод для отправки HTTP-запросов.
   * @param endpoint - конечная точка для запроса.
   * @param method - HTTP метод (по умолчанию 'GET').
   * @param body - тело запроса (по умолчанию пустое).
   * @returns Ответ от сервера.
   */
  private async sendRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST' = 'GET',
    body: any = null
  ): Promise<T> {
    const options = {
      method,
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body,
    };

    const response = await firstValueFrom(
      this.http.request<T>(method, `${this.baseUrl}/${endpoint}`, options)
    );
    return response;
  }
}
