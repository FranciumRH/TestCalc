import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServerDataService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  clearServerData(): Promise<void> {
    return this.http
      .post(`${this.baseUrl}/clear-data`, {}, { headers: { 'Content-Type': 'application/json' } })
      .toPromise()
      .then(() => console.log('Серверные данные успешно очищены.'))
      .catch((error) => console.error('Ошибка при очистке серверных данных:', error));
  }

  fetchData(endpoint: string): Promise<any> {
    return this.http.get(`${this.baseUrl}/${endpoint}`).toPromise();
  }

  sendData(endpoint: string, data: any): void {
    this.http
      .post(`${this.baseUrl}/${endpoint}`, data, { headers: { 'Content-Type': 'application/json' } })
      .subscribe({
        next: (response: any) => console.log('Данные успешно отправлены:', response),
        error: (error) => console.error('Ошибка при отправке данных:', error),
      });
  }
}