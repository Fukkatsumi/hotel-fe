import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConstantsService} from '../../../../../services/constants.service';
import {take} from "rxjs/operators";
import {SelectService} from "../../../../../services/select.service";
import {MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";

/**
 * @title Dialog with header, scrollable content and actions
 */

const URL = new ConstantsService().BASE_URL;

@Component({
  selector: 'app-delete-booking-dialog',
  styleUrls: ['../../../styles/change-dialog.css'],
  templateUrl: './delete-booking-dialog.html',
})
export class DeleteBookingDialogComponent {

  constructor(private http: HttpClient, private selectService: SelectService,
              private matDialogRef: MatDialogRef<DeleteBookingDialogComponent>,
              private snackBar: MatSnackBar) {
  }

  deleteBooking() {
    this.selectService.selectAnnounced$
      .pipe(take(1))
      .subscribe(id => {
        this.http.delete(URL + 'bookings/' + id.id)
          .subscribe(res => {
            this.selectService.announceSelect(null);
            this.matDialogRef.close();
            this.snackBar.open('Delete succeeded!', 'Ok', {duration: 6000});
            this.selectService.announceDelete(1);
          }, error => {
            this.matDialogRef.close();
            this.snackBar.open(error.error, 'Ok', {duration: 6000});
          });
      });
  }
}



