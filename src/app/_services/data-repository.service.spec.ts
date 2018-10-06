import { TestBed } from '@angular/core/testing';

import { DataRepositoryService } from './data-repository.service';

describe('DataRepositoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataRepositoryService = TestBed.get(DataRepositoryService);
    expect(service).toBeTruthy();
  });
});
