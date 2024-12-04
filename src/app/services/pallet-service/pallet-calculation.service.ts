import { Injectable } from '@angular/core';
import { DetailedResult, PalletMetrics, TotalData } from '../../models/server-data.model';

@Injectable({
  providedIn: 'root'
})
export class PalletCalculationService {
  // Извлечение формата упаковки из имени товара
  private extractPalletFormat(name: string): { boxes: number; pallets: number } | null {
    const regex = /\((\d+)\/(\d+)\)/; // Формат (шт/коробок)
    const match = name.match(regex);

    if (match) {
      const boxes = parseInt(match[1], 10);
      const pallets = parseInt(match[2], 10);
      if (!isNaN(boxes) && !isNaN(pallets)) {
        return { boxes, pallets };
      }
    }
    return null;
  }

  // Основной метод расчета
  public calculatePalletsFromItems(items: TotalData[]): PalletMetrics {
    let totalPalletsNeeded = 0;
    const detailedResults: DetailedResult[] = [];

    items.forEach((item) => {
      const result = this.processItem(item);
      if (result) {
        totalPalletsNeeded += result.palletsForItem;
        detailedResults.push(result);
      } else {
        console.warn(`Позиция "${item.name}" пропущена из-за некорректных данных.`);
      }
    });

    return { totalPalletsNeeded, detailedResults };
  }

  // Обработка одной позиции
  private processItem(item: TotalData): DetailedResult | null {
    const palletFormat = this.extractPalletFormat(item.name);
    if (!palletFormat) {
      return null; // Если формат упаковки не найден
    }

    const { boxes, pallets } = palletFormat;
    const totalUnits = item.quantity;

    if (isNaN(totalUnits) || totalUnits <= 0) {
      return null; // Если количество некорректное
    }

    // Расчет коробок
    const fullBoxes = Math.floor(totalUnits / boxes);
    const remainingUnits = totalUnits % boxes; // Остаток единиц товара

    // Расчет паллетов
    const fullPallets = Math.floor(fullBoxes / pallets);
    const remainingBoxes = fullBoxes % pallets; // Остаток коробок, не вошедших в полный паллет

    const palletsForItem = fullPallets + (remainingBoxes > 0 ? 1 : 0); // Учитываем неполные паллеты

    return {
      name: item.name,
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

  public getDetailedResults(items: TotalData[]): Array<any> {
    const { detailedResults } = this.calculatePalletsFromItems(items);

    // Приводим данные в нужный формат
    return detailedResults.map((result) => ({
      itemName: result.name,
      totalUnits: result.totalUnits,         // Общее количество товара
      fullBoxes: result.fullBoxes,           // Количество полных коробок
      remainingUnits: result.remainingUnits, // Остаток единиц товара
      fullPallets: result.fullPallets,      // Количество полных паллет
      remainingBoxes: result.remainingBoxes, // Количество остаточных коробок
      palletsForItem: result.palletsForItem, // Количество паллет для этого товара
    }));
  }
}