import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-pallet-capacity-calculation',
  standalone: true, // Это Standalone компонент
  imports: [CommonModule, HttpClientModule], // Здесь импортируем HttpClientModule
  templateUrl: './pallet-capacity-calculation.component.html',
  styleUrls: ['./pallet-capacity-calculation.component.scss']
})

export class PalletCapacityCalculationComponent implements OnInit {
  @Input() totalData: any[] = [];

  totalPallets: number = 700; // Общее количество паллет по умолчанию
  occupiedPallets: number = 0; // Занятые паллеты
  occupancyPercentage: number = 0; // Процент заполнения
  occupancyColor: string = 'green'; // Цвет индикатора заполненности

  private updateInterval: any;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    if (this.totalData && this.totalData.length > 0) {
      this.calculatePalletsFromItems(this.totalData);
    }
    this.fetchPalletsData();  // Получаем данные о паллетах
    this.fetchTotalData();  // Получаем только данные о total
    this.startAutoUpdate()
  }

  ngOnChanges(): void {
    if (this.totalData && this.totalData.length > 0) {
      this.calculatePalletsFromItems(this.totalData);
    }
  }

  ngOnDestroy(): void {
    // Очищаем таймер при уничтожении компонента
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }

  fetchTotalDataFromServer(): void {
    console.log('Запрос данных с сервера...');
    this.http.get<any>('http://localhost:3000/get-total').subscribe({
      next: (response) => {
        console.log('Ответ от сервера:', response); // Логируем полученные данные
        const totalData = response.totalData;
        if (Array.isArray(totalData)) {
          this.calculatePalletsFromItems(totalData);
        } else {
          console.error('Ошибка: данные не в правильном формате');
        }
      },
      error: (error) => {
        console.error('Ошибка при получении данных с сервера:', error);
      }
    });
  }

  // Запрос для получения данных о паллетах
  fetchPalletsData(): void {
    this.http.get<any>('http://localhost:3000/get-pallets').subscribe({
      next: (response) => {
        console.log('Ответ от сервера для паллет:', response);
        if (response && response.occupiedPallets !== undefined) {
          this.occupiedPallets = response.occupiedPallets;
          this.updateOccupancy();  // Обновляем индикатор заполненности
        } else {
          console.error('Ошибка при получении данных о паллетах');
        }
      },
      error: (error) => {
        console.error('Ошибка при получении данных о паллетах:', error);
      }
    });
  }

  // Запрос для получения только данных о total
  fetchTotalData(): void {
    this.http.get<any>('http://localhost:3000/get-total').subscribe({
      next: (response) => {
        console.log('Ответ от сервера для данных total:', response);
        const totalData = response; // Теперь просто получаем только totalData
        if (totalData && Array.isArray(totalData)) {
          this.calculatePalletsFromItems(totalData); // Рассчитываем паллеты только для totalData
        } else {
          console.error('Ошибка: данные не в правильном формате');
        }
      },
      error: (error) => {
        console.error('Ошибка при получении данных о total:', error);
      }
      // ТУТ БУДЕТ КЕШИРОВАНИЕ ТОТАЛ ПАЛЕТОВ, ПРОСТО ОНО МЕШАЕТ СКРОЛЛИТЬ
    });
  }

  // Вычисление паллет из данных о товарах
  calculatePalletsFromItems(items: any[]): void {
    let totalPalletsNeeded = 0;

    // Перебираем все товары и рассчитываем паллеты
    items.forEach(item => {
      const quantity = parseInt(item.quantity, 10); // Преобразуем строку в число
      if (!isNaN(quantity)) {
        const palletsForItem = quantity / 3 / 80; // Пример расчета паллетов (в данном случае делим на 3 и 80)
        totalPalletsNeeded += palletsForItem;
      }
    });

    this.occupiedPallets = Math.round(totalPalletsNeeded); // Округляем до целого числа
    this.updateOccupancy(); // Обновляем индикатор заполненности
  }

  // Обновляем процент заполненности и цвет
  updateOccupancy(): void {
    // Рассчитываем процент заполненности
    this.occupancyPercentage = Math.round((this.occupiedPallets / this.totalPallets) * 100);

    // Устанавливаем цвет в зависимости от процента заполненности
    if (this.occupancyPercentage < 50) {
      this.occupancyColor = 'green';
    } else if (this.occupancyPercentage >= 50 && this.occupancyPercentage < 85) {
      this.occupancyColor = 'orange';
    } else {
      this.occupancyColor = 'red';
    }
  }

  // Обновление данных о паллетах на сервере
  updatePalletsOnServer(): void {
    this.http.post('http://localhost:3000/update-pallets', { occupiedPallets: this.occupiedPallets })
      .subscribe({
        next: (response) => {
          console.log('Данные о паллетах успешно обновлены на сервере:', response);
        },
        error: (error) => {
          console.error('Ошибка при обновлении данных о паллетах:', error);
        }
      });
  }



  startAutoUpdate(): void {
    console.log('Автоматическое обновление запущено');
    this.updateInterval = setInterval(() => {
      console.log('Обновление данных...');
      this.fetchTotalDataFromServer();
    }, 15000); // интервал в 15 секунд
  }
}