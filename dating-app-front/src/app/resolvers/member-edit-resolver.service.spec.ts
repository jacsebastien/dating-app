import { TestBed, inject } from '@angular/core/testing';

import { MemberEditResolverService } from './member-edit-resolver.service';

describe('MemberEditResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MemberEditResolverService]
    });
  });

  it('should be created', inject([MemberEditResolverService], (service: MemberEditResolverService) => {
    expect(service).toBeTruthy();
  }));
});
