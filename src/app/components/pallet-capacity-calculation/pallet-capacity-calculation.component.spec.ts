import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PalletCapacityCalculationComponent } from './pallet-capacity-calculation.component';
import { ServerDataService } from '../../services/dataService/data.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PalletCapacityCalculationComponent', () => {
  let component: PalletCapacityCalculationComponent;
  let fixture: ComponentFixture<PalletCapacityCalculationComponent>;
  let mockServerDataService: jasmine.SpyObj<ServerDataService>;

  beforeEach(async () => {
    mockServerDataService = jasmine.createSpyObj('ServerDataService', ['fetchData']);

    await TestBed.configureTestingModule({
      declarations: [PalletCapacityCalculationComponent],
      imports: [HttpClientTestingModule],
      providers: [{ provide: ServerDataService, useValue: mockServerDataService }],
    }).compileComponents();

    fixture = TestBed.createComponent(PalletCapacityCalculationComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    if (component['updateInterval']) {
      clearInterval(component['updateInterval']);
    }
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should update metrics on initialization', fakeAsync(() => {
    const mockData = [{ quantity: '240' }];
    mockServerDataService.fetchData.and.returnValue(Promise.resolve(mockData));
  
    component.ngOnInit();
    tick();
  
    expect(mockServerDataService.fetchData).toHaveBeenCalled();
    expect(component.occupiedPallets).toBe(1); // 240/3/80 = 1
  }));

  it('should start auto-update on initialization', fakeAsync(() => {
    spyOn(component as any, 'updatePalletMetrics');

    component.ngOnInit();
    tick(15000);

    expect(component['updatePalletMetrics']).toHaveBeenCalled();
  }));

  it('should calculate pallets correctly from items', () => {
    const items = [
      { quantity: '240' },
      { quantity: '120' },
    ];

    component.calculatePalletsFromItems(items);

    expect(component.occupiedPallets).toBe(2); // 240/3/80 + 120/3/80 = 2
  });

  it('should update occupancy metrics correctly', () => {
    component.totalPallets = 700;
    component.occupiedPallets = 350;

    component['updateOccupancy']();

    expect(component.occupancyPercentage).toBe(50);
    expect(component.occupancyColor).toBe('green');

    component.occupiedPallets = 600;
    component['updateOccupancy']();

    expect(component.occupancyPercentage).toBe(86);
    expect(component.occupancyColor).toBe('red');
  });

  it('should clear interval on component destroy', () => {
    spyOn(window, 'clearInterval');

    component.ngOnDestroy();

    expect(clearInterval).toHaveBeenCalledWith(component['updateInterval']);
  });

  it('should fetch data and update pallets on updatePalletMetrics', fakeAsync(() => {
    const mockData = [{ quantity: '240' }];
    mockServerDataService.fetchData.and.returnValue(Promise.resolve(mockData));

    spyOn(component, 'calculatePalletsFromItems');

    component['updatePalletMetrics']();
    tick();

    expect(mockServerDataService.fetchData).toHaveBeenCalledWith('get-total');
    expect(component.calculatePalletsFromItems).toHaveBeenCalledWith(mockData);
  }));
});
