import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TotalData } from '../../models/server-data.model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class ServerDataService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Очистка данных на сервере
  async clearServerData(): Promise<void> {
    try {
      await firstValueFrom(
        this.http.post<void>(`${this.baseUrl}/clear-data`, {}, {
          headers: { 'Content-Type': 'application/json' },
        })
      );
      console.log('Серверные данные успешно очищены.');
    } catch (error) {
      console.error('Ошибка при очистке серверных данных:', error);
    }
  }

  // Получение данных с сервера
  async fetchData(endpoint: string): Promise<TotalData[]> {
    try {
      const data = await firstValueFrom(
        this.http.get<TotalData[]>(`${this.baseUrl}/${endpoint}`)
      );

      console.log('Полученные данные с сервера:', data);

      // Если сервер вернул что-то не то, возвращаем пустой массив
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Ошибка при получении данных с сервера:', error);
      return [];
    }
  }

  // Отправка данных на сервер
  async sendData(endpoint: string, data: TotalData[]): Promise<void> {
    try {
      await firstValueFrom(
        this.http.post<void>(`${this.baseUrl}/${endpoint}`, data, {
          headers: { 'Content-Type': 'application/json' },
        })
      );
      console.log('Данные успешно отправлены:', data);
    } catch (error) {
      console.error('Ошибка при отправке данных:', error);
    }
  }
}
