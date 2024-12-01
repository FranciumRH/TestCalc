import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ExcelImportComponent } from './excel-import.component';
import { ExcelService } from '../../services/excelService/excel.service';
import { ServerDataService } from '../../services/dataService/data.service';
import { of } from 'rxjs';

describe('ExcelImportComponent', () => {
  let component: ExcelImportComponent;
  let fixture: ComponentFixture<ExcelImportComponent>;
  let excelServiceSpy: jasmine.SpyObj<ExcelService>;
  let serverDataServiceSpy: jasmine.SpyObj<ServerDataService>;

  beforeEach(() => {
    const excelServiceMock = jasmine.createSpyObj('ExcelService', ['parseFileToJson', 'extractGroupedData']);
    const serverDataServiceMock = jasmine.createSpyObj('ServerDataService', ['clearServerData', 'sendData']);

    TestBed.configureTestingModule({
      declarations: [ExcelImportComponent],
      providers: [
        { provide: ExcelService, useValue: excelServiceMock },
        { provide: ServerDataService, useValue: serverDataServiceMock },
      ],
    });

    fixture = TestBed.createComponent(ExcelImportComponent);
    component = fixture.componentInstance;
    excelServiceSpy = TestBed.inject(ExcelService) as jasmine.SpyObj<ExcelService>;
    serverDataServiceSpy = TestBed.inject(ServerDataService) as jasmine.SpyObj<ServerDataService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should process file and update total data', async () => {
    const mockFile = new Blob();
    const mockJsonData = [{ Name: 'Test' }];
    const mockGroupedData = {
      polikarpovaData: [],
      pollyData: [],
      totalData: [{ name: 'Item 1', quantity: '10', reserved: '5', availableStock: '5' }],
    };

    excelServiceSpy.parseFileToJson.and.returnValue(mockJsonData);
    excelServiceSpy.extractGroupedData.and.returnValue(mockGroupedData);
    serverDataServiceSpy.clearServerData.and.returnValue(Promise.resolve());

    spyOn(component.totalDataUpdated, 'emit');

    await component.onFileChange({ target: { files: [mockFile] } });

    expect(excelServiceSpy.parseFileToJson).toHaveBeenCalled();
    expect(excelServiceSpy.extractGroupedData).toHaveBeenCalledWith(mockJsonData);
    expect(serverDataServiceSpy.clearServerData).toHaveBeenCalled();
    expect(serverDataServiceSpy.sendData).toHaveBeenCalledWith('save-data', mockGroupedData);
    expect(component.totalDataUpdated.emit).toHaveBeenCalledWith(mockGroupedData.totalData);
  });
});
