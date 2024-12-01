import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ServerDataService } from './data.service';

describe('ServerDataService', () => {
  let service: ServerDataService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ServerDataService],
    });

    service = TestBed.inject(ServerDataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should clear server data', (done) => {
    service.clearServerData().then(() => {
      done();
    });

    const req = httpMock.expectOne('http://localhost:3000/clear-data');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should send data to the server', () => {
    const testData = { key: 'value' };

    service.sendData('save-data', testData);

    const req = httpMock.expectOne('http://localhost:3000/save-data');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(testData);
  });
});
