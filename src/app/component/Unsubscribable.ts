import {Subject} from 'rxjs';
import {OnDestroy} from '@angular/core';
import {SelectService} from '../services/select.service';

export class Unsubscribable implements OnDestroy {
  destroy$ = new Subject();
  constructor(public selectService: SelectService) {
    this.selectService = selectService;
  }


  ngOnDestroy(): void {
    this.selectService.announceSelect(null);
    this.selectService.announceAdd(null);
    this.selectService.announceDelete(null);
    this.destroy$.next();
  }
}
