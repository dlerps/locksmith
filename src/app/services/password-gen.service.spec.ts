/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PasswordGenService } from './password-gen.service';

describe('Service: PasswordGen', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PasswordGenService]
    });
  });

  it('should ...', inject([PasswordGenService], (service: PasswordGenService) => {
    expect(service).toBeTruthy();
  }));
});
