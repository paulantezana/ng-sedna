

import { of } from 'rxjs';
import { delay, finalize, takeUntil } from 'rxjs/operators';

import { SnDestroyService } from './destroy';

describe('NzDestroy service', () => {
  let destroyService: SnDestroyService;
  const initObservable = of('done');

  beforeEach(() => {
    destroyService = new SnDestroyService();
  });

  it('should subscribe work normal', () => {
    let result = 'initial';

    initObservable.pipe(takeUntil(destroyService)).subscribe(value => {
      result = value;
    });

    expect(result).toBe('done');
  });

  it('should complete work normal', () => {
    let result = 'initial';

    initObservable
      .pipe(
        delay(1000),
        takeUntil(destroyService),
        finalize(() => {
          result = 'done';
        })
      )
      .subscribe();

    destroyService.ngOnDestroy();

    expect(result).toBe('done');
  });
});
