import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  parseFileToJson(arrayBuffer: ArrayBuffer): any[] {
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return XLSX.utils.sheet_to_json(sheet, { header: 1 });
  }

  extractGroupedData(data: any[]): { polikarpovaData: any[]; pollyData: any[]; totalData: any[] } {
    const polikarpovaData: any[] = [];
    const pollyData: any[] = [];
    const totalData: any[] = [];
    let currentSupplier: string | null = null;

    data.slice(2).forEach((row) => {
      const firstColumn = row[0]?.toString().trim().toLowerCase();

      if (this.isSupplierRow(firstColumn)) {
        currentSupplier = this.getSupplierName(firstColumn);
        return;
      }

      if (this.isSummaryRow(firstColumn) || !this.isValidRow(row)) {
        return;
      }

      const item = this.parseRowToItem(row);
      this.addToSupplierData(item, currentSupplier, polikarpovaData, pollyData);
      totalData.push(item);
    });

    return { polikarpovaData, pollyData, totalData };
  }

  private isSupplierRow(firstColumn: string): boolean {
    return firstColumn === 'поликарпова' || firstColumn === 'полли';
  }

  private getSupplierName(firstColumn: string): string {
    return firstColumn === 'поликарпова' ? 'Поликарпова' : 'Полли';
  }

  private isSummaryRow(firstColumn: string): boolean {
    return firstColumn === 'итого';
  }

  private isValidRow(row: any[]): boolean {
    return row && row.length >= 2;
  }

  private parseRowToItem(row: any[]): any {
    return {
      name: row[0]?.toString().trim(),
      quantity: this.parseCellValue(row[2]),
      reserved: this.parseCellValue(row[3]),
      availableStock: this.parseCellValue(row[4]),
    };
  }

  private addToSupplierData(item: any, supplier: string | null, polikarpovaData: any[], pollyData: any[]): void {
    if (supplier === 'Поликарпова') {
      polikarpovaData.push(item);
    } else if (supplier === 'Полли') {
      pollyData.push(item);
    }
  }

  private parseCellValue(value: any): string {
    if (value === null || value === undefined || value === '') return '0';
    if (typeof value === 'number') return value.toString();

    const cleanedValue = value.toString().replace(/,/g, '').trim();
    return isNaN(parseFloat(cleanedValue)) ? '0' : Math.floor(parseFloat(cleanedValue)).toString();
  }
}