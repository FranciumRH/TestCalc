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

    const fullBoxes = this.calculateFullBoxes(totalUnits, boxes);
    const remainingUnits = this.calculateRemainingUnits(totalUnits, boxes);
    const fullPallets = this.calculateFullPallets(fullBoxes, pallets);
    const remainingBoxes = this.calculateRemainingBoxes(fullBoxes, pallets);
    const palletsForItem = this.calculatePalletsForItem(fullPallets, remainingBoxes, remainingUnits);

    return this.createDetailedResult(item, boxes, pallets, totalUnits, fullBoxes, remainingUnits, fullPallets, remainingBoxes, palletsForItem);
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
   * @param boxes, pallets, totalUnits - расчетные данные.
   * @returns Объект с детализированным результатом.
   */
  private createDetailedResult(
    item: TotalData,
    boxes: number,
    pallets: number,
    totalUnits: number,
    fullBoxes: number,
    remainingUnits: number,
    fullPallets: number,
    remainingBoxes: number,
    palletsForItem: number
  ): DetailedResult {
    return {
      itemName: item.name,
      boxes,
      pallets,
      totalUnits,
      fullBoxes,
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
      fullBoxes: result.fullBoxes,
      remainingUnits: result.remainingUnits,
      fullPallets: result.fullPallets,
      remainingBoxes: result.remainingBoxes,
      palletsForItem: result.palletsForItem,
    }));
  }

  // Методы для вычислений, такие как:
  private calculateFullBoxes(totalUnits: number, boxes: number): number {
    return Math.floor(totalUnits / boxes);
  }

  private calculateRemainingUnits(totalUnits: number, boxes: number): number {
    return totalUnits % boxes;
  }

  private calculateFullPallets(fullBoxes: number, pallets: number): number {
    return Math.floor(fullBoxes / pallets);
  }

  private calculateRemainingBoxes(fullBoxes: number, pallets: number): number {
    return fullBoxes % pallets;
  }

  private calculatePalletsForItem(fullPallets: number, remainingBoxes: number, remainingUnits: number): number {
    return fullPallets + (remainingBoxes > 0 || remainingUnits > 0 ? 1 : 0);
  }
}
