export interface TotalData {
  id: string;         
  name: string;       
  quantity: number;       // Количество
  reserved: number;       // Забронированное количество
  availableStock: number; // Доступный остаток
}

export interface TotalData {
  name: string;        // Название товара
  quantity: number;    // Общее количество единиц товара
}

export interface PalletMetrics {
  totalPalletsNeeded: number; // Общее количество паллетов
  detailedResults: DetailedResult[]; // Детализированные результаты по позициям
}

export interface DetailedResult {
  itemName: string;        // Название товара
  boxes: number;       // Количество единиц в одной коробке
  pallets: number;     // Количество коробок в одном паллете
  totalUnits: number;  // Общее количество единиц товара
  fullBoxes: number;   // Количество полных коробок
  remainingUnits: number; // Остаток штучных единиц товара
  fullPallets: number; // Количество полных паллетов
  remainingBoxes: number; // Остаток коробок, не вошедших в полный паллет
  palletsForItem: number; // Итоговое количество паллетов (включая неполные)
}

export interface TableRow {
  name: string;
  totalUnits: number;
  boxes: number;
  pallets: number;
  remaining: number;
}