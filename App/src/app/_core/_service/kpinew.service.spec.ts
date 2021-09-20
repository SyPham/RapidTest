/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { KpinewService } from './kpinew.service';

describe('Service: Kpinew', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KpinewService]
    });
  });

  it('should ...', inject([KpinewService], (service: KpinewService) => {
    expect(service).toBeTruthy();
  }));
});
