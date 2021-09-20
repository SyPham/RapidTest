/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { OcPolicyService } from './OcPolicy.service';

describe('Service: OcPolicy', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OcPolicyService]
    });
  });

  it('should ...', inject([OcPolicyService], (service: OcPolicyService) => {
    expect(service).toBeTruthy();
  }));
});
