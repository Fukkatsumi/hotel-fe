import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectService {

  // Observable object sources
  private selectAnnouncedSource = new BehaviorSubject<any>(null);
  private addAnnouncedSource = new BehaviorSubject<any>(null);
  private deleteAnnouncedSource = new BehaviorSubject<any>(null);

  // Observable object streams
  selectAnnounced$ = this.selectAnnouncedSource.asObservable();
  addAnnounced$ = this.addAnnouncedSource.asObservable();
  deleteAnnounced$ = this.deleteAnnouncedSource.asObservable();

  // Service message commands
  announceSelect(row: any) {
    console.log(row);
    this.selectAnnouncedSource.next(row);
  }

  announceAdd(row: any) {
    console.log(row);
    this.addAnnouncedSource.next(row);
  }

  announceDelete(row: any) {
    console.log(row);
    this.deleteAnnouncedSource.next(row);
  }
}
