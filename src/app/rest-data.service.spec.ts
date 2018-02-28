import { TestBed, inject } from '@angular/core/testing';

import { RestDataService } from './rest-data.service';

describe('RestDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RestDataService]
    });
  });

  it('should be created', inject([RestDataService], (service: RestDataService) => {
    expect(service).toBeTruthy();
  }));
});
