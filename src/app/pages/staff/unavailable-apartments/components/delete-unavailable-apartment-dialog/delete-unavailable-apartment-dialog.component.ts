import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConstantsService} from '../../../../../services/constants.service';
import {take} from 'rxjs/operators';
import {SelectService} from '../../../../../services/select.service';
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialogRef} from "@angular/material/dialog";

/**
 * @title Dialog with header, scrollable content and actions
 */

const URL = new ConstantsService().BASE_URL;

@Component({
  selector: 'app-delete-unavailable-apartment-dialog',
  styleUrls: ['../../../styles/change-dialog.css'],
  templateUrl: './delete-unavailable-apartment-dialog.html',
})
export class DeleteUnavailableApartmentDialogComponent {

  constructor(private http: HttpClient, private selectService: SelectService,
              private snackBar: MatSnackBar,
              private matDialogRef: MatDialogRef<DeleteUnavailableApartmentDialogComponent>) {
  }

  deleteUnavailableApartment() {
    this.selectService.selectAnnounced$
      .pipe(take(1))
      .subscribe(id => {
        this.http.delete(URL + 'unavailableApartments/' + id.id)
          .subscribe(res => {
            this.selectService.announceSelect(null);
            this.selectService.announceDelete(res);
            this.matDialogRef.close();
            this.snackBar.open('Delete succeeded!', 'Ok', {duration: 8000});
          }, error => {
            this.matDialogRef.close();
            this.snackBar.open(error.error, 'Ok', {duration: 8000});
          });
      });
  }
}



