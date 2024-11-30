import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-excel-import',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './excel-import.component.html',
  styleUrls: ['./excel-import.component.scss']
})
export class ExcelImportComponent {
  @Output() totalDataUpdated = new EventEmitter<any>();

  constructor(private http: HttpClient) { }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.processFile(e.target.result);
      reader.readAsArrayBuffer(file); 
      event.target.value = ''; 
    }
  }

  async processFile(arrayBuffer: ArrayBuffer): Promise<void> {
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const { polikarpovaData, pollyData, totalData } = this.extractGroupedData(jsonData);

    const currentData = await this.fetchDataFromServer();
    const updatedData = this.updateAllData(currentData, polikarpovaData, pollyData);

    this.sendDataToServer(updatedData.polikarpovaData, updatedData.pollyData, updatedData.totalData);
    
    this.totalDataUpdated.emit(updatedData.totalData);
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

  updateAllData(currentData: any, polikarpovaData: any[], pollyData: any[]): any {
    const updatedPolikarpova = this.updateSupplierData(currentData.polikarpovaData, polikarpovaData);
    const updatedPolly = this.updateSupplierData(currentData.pollyData, pollyData);
    const totalData = [...updatedPolikarpova, ...updatedPolly];

    return { polikarpovaData: updatedPolikarpova, pollyData: updatedPolly, totalData };
  }

  updateSupplierData(existingData: any[], newData: any[]): any[] {
    const updatedData = [...existingData];

    newData.forEach((newItem) => {
      const existingItem = updatedData.find((item) => item.name === newItem.name);

      if (existingItem) {
        this.updateItem(existingItem, newItem);
      } else {
        updatedData.push({ ...newItem });
      }
    });

    return updatedData;
  }

  private updateItem(existingItem: any, newItem: any): void {
    existingItem.quantity = this.addNumericValues(existingItem.quantity, newItem.quantity);
    existingItem.reserved = this.addNumericValues(existingItem.reserved, newItem.reserved);
    existingItem.availableStock = this.addNumericValues(existingItem.availableStock, newItem.availableStock);
  }

  private addNumericValues(value1: string, value2: string): string {
    const num1 = parseFloat(value1) || 0;
    const num2 = parseFloat(value2) || 0;
    return (num1 + num2).toString();
  }

  private parseCellValue(value: any): string {
    if (value === null || value === undefined || value === '') return '0';
    if (typeof value === 'number') return value.toString();

    const cleanedValue = value.toString().replace(/,/g, '').trim();
    return isNaN(parseFloat(cleanedValue)) ? '0' : Math.floor(parseFloat(cleanedValue)).toString();
  }

  async fetchDataFromServer(): Promise<any> {
    return this.http.get('http://localhost:3000/get-data').toPromise();
  }

  sendDataToServer(polikarpovaData: any[], pollyData: any[], totalData: any[]): void {
    const data = { polikarpovaData, pollyData, totalData };

    this.http
      .post('http://localhost:3000/save-data', data, { headers: { 'Content-Type': 'application/json' } })
      .subscribe({
        next: (response: any) => {
          if (response?.status === 'success') {
            console.log('Данные успешно обновлены на сервере:', response);
          } else {
            console.error('Данные не были приняты сервером:', response);
          }
        },
        error: (error) => console.error('Ошибка при получении ответа от сервера:', error),
      });
  }
}