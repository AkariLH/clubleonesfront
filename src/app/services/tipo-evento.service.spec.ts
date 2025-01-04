import { TestBed } from '@angular/core/testing';

import { TipoEventoService } from './tipo-evento.service';

describe('TipoEventoService', () => {
  let service: TipoEventoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoEventoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
