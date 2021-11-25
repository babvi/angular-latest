import { TestBed, inject } from '@angular/core/testing';

import { HCCService } from './hcc.service';

describe('HCCService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HCCService]
    });
  });

  it('should be created', inject([HCCService], (service: HCCService) => {
    expect(service).toBeTruthy();
  }));
});
