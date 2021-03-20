import { TestBed } from '@angular/core/testing';

import { BullListenerService } from './bull-listener.service';

describe('BullListenerService', () => {
  let service: BullListenerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BullListenerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
