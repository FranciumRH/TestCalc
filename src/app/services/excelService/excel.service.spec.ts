import { TestBed } from '@angular/core/testing';
import { ExcelService } from './excel.service';
import * as XLSX from "xlsx";
describe('ExcelService', () => {
  let service: ExcelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExcelService);
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should parse Excel file to JSON', () => {
    const mockArrayBuffer = new ArrayBuffer(8); // Простой тестовый ArrayBuffer
    const mockJson = [{ Name: 'Test' }];

    spyOn(XLSX.utils, 'sheet_to_json').and.returnValue(mockJson);

    const result = service.parseFileToJson(mockArrayBuffer);
    expect(result).toEqual(mockJson);
  });

  it('should extract grouped data correctly', () => {
    const mockData = [
      ['Name', 'Quantity', 'Reserved', 'Available'],
      ['Поликарпова'],
      ['Item 1', '', '10', '5', '5'],
      ['Полли'],
      ['Item 2', '', '15', '10', '5'],
    ];

    const result = service.extractGroupedData(mockData);

    expect(result.polikarpovaData.length).toBe(1);
    expect(result.pollyData.length).toBe(1);
    expect(result.totalData.length).toBe(2);
  });

  it('should correctly identify supplier rows', () => {
    expect(service['isSupplierRow']('поликарпова')).toBeTrue();
    expect(service['isSupplierRow']('полли')).toBeTrue();
    expect(service['isSupplierRow']('что-то другое')).toBeFalse();
  });

  it('should correctly parse cell values', () => {
    expect(service['parseCellValue']('10')).toBe('10');
    expect(service['parseCellValue']('')).toBe('0');
    expect(service['parseCellValue'](null)).toBe('0');
  });
});
