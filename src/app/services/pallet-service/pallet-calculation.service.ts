import { Injectable } from '@angular/core';
import { DetailedResult, PalletMetrics, TotalData } from '../../models/server-data.model';
import { ServerDataService } from '../dataService/data.service';


@Injectable({
  providedIn: 'root',
})
export class PalletCalculationService {
  constructor(private serverDataService: ServerDataService) {}

  /**
   * Основной метод для расчета паллет из данных товаров.
   * @param items - список товаров с количеством.
   * @returns Объект, содержащий общее количество паллет и детализированные результаты.
   */
  public calculatePalletsFromItems(items: TotalData[]): PalletMetrics {
    const detailedResults: DetailedResult[] = items
      .map((item) => this.processItem(item))
      .filter(Boolean) as DetailedResult[];

    const totalPalletsNeeded = detailedResults.reduce(
      (sum, result) => sum + result.palletsForItem,
      0
    );

    // Отправляем детализированные результаты на сервер для генерации Excel
    this.sendDetailedResultsToServer(detailedResults);

    return { totalPalletsNeeded, detailedResults };
  }

  /**
   * Обрабатывает один товар, извлекая информацию о его упаковке.
   * @param item - объект с данными о товаре.
   * @returns Детализированный результат или null, если данные некорректны.
   */
  private processItem(item: TotalData): DetailedResult | null {
    const palletFormat = this.extractPalletFormat(item.name);
    if (!palletFormat || isNaN(item.quantity) || item.quantity <= 0) return null;

    const { boxes, pallets } = palletFormat;
    const totalUnits = item.quantity;

    // Шаг 1: Переводим в коробки
    const fullBoxes = Math.floor(totalUnits / boxes); // Полные коробки
    const remainingUnitsAfterBoxes = totalUnits % boxes; // Остаточные штуки после коробок

    // Шаг 2: Переводим в паллеты
    const fullPallets = Math.floor(fullBoxes / pallets); // Полные паллеты
    const remainingBoxes = fullBoxes % pallets; // Остаточные коробки после паллет

    // Шаг 3: Преобразуем остаточные коробки и остаточные единицы в поштучное количество
    const remainingUnits = remainingBoxes * boxes + remainingUnitsAfterBoxes; // Оставшиеся единицы в штуках

    // Шаг 4: Если есть остаточные единицы, увеличиваем количество паллет на 1
    const palletsForItem = fullPallets + (remainingUnits > 0 ? 1 : 0); // Добавляем паллет для остатков

    return this.createDetailedResult(item, totalUnits, fullPallets, remainingUnits, remainingBoxes, palletsForItem);
  }

  /**
   * Отправляет детализированные результаты на сервер для создания Excel таблицы.
   * @param detailedResults - детализированные данные для отправки.
   */
  private sendDetailedResultsToServer(detailedResults: DetailedResult[]): void {
    this.serverDataService.sendData('create-excel', detailedResults)
      .then(() => {
        console.log('Данные для Excel успешно отправлены на сервер.');
      })
      .catch((error) => {
        console.error('Ошибка при отправке данных на сервер:', error);
      });
  }

  /**
   * Извлекает формат упаковки товара из его имени.
   * @param name - имя товара.
   * @returns Объект с количеством коробок и паллет, или null, если формат не найден.
   */
  private extractPalletFormat(name: string): { boxes: number; pallets: number } | null {
    const regex = /\((\d+)\/(\d+)\)/;
    const match = name.match(regex);

    return match ? { boxes: parseInt(match[1], 10), pallets: parseInt(match[2], 10) } : null;
  }

  /**
   * Формирует детализированный результат для одного товара.
   * @param item - объект с данными о товаре.
   * @param totalUnits, fullPallets, remainingUnits, palletsForItem - расчетные данные.
   * @returns Объект с детализированным результатом.
   */
  private createDetailedResult(
    item: TotalData,
    totalUnits: number,
    fullPallets: number,
    remainingUnits: number,
    remainingBoxes: number,
    palletsForItem: number
  ): DetailedResult {
    return {
      itemName: item.name,
      boxes: item.quantity,  // Сохраняем общее количество единиц
      pallets: 0,            // Количество коробок на паллете (в данном случае не используется)
      totalUnits,
      fullBoxes: 0,          // Количество полных коробок (не используется)
      remainingUnits,
      fullPallets,
      remainingBoxes,
      palletsForItem,
    };
  }

  /**
   * Преобразует результаты в удобный для отображения формат.
   * @param items - список товаров с количеством.
   * @returns Массив объектов для отображения.
   */
  public getDetailedResults(items: TotalData[]): any[] {
    const { detailedResults } = this.calculatePalletsFromItems(items);

    return detailedResults.map((result) => ({
      itemName: result.itemName,
      totalUnits: result.totalUnits,
      fullPallets: result.fullPallets,
      remainingUnits: result.remainingUnits,
      palletsForItem: result.palletsForItem,
    }));
  }
}
