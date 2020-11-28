import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {ApartmentsClass} from '../../../../../component/apartments-class';
import {ConstantsService} from '../../../../../services/constants.service';
import {DataTransferService} from "../../../../../services/data-transfer.service";
import {SelectService} from "../../../../../services/select.service";
import {take} from "rxjs/operators";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialogRef} from "@angular/material/dialog";


/**
 * @title Dialog with header, scrollable content and actions
 */

const URL = new ConstantsService().BASE_URL;

@Component({
  selector: 'app-delete-apartments-classes-dialog',
  styleUrls: ['../../../styles/change-dialog.css'],
  templateUrl: './delete-apartments-classes-dialog.html',
})
export class DeleteApartmentsClassesDialogComponent {

  constructor(private http: HttpClient, private selectService: SelectService,
              private snackBar: MatSnackBar,
              private matDialogRef: MatDialogRef<DeleteApartmentsClassesDialogComponent>) {
  }

  deleteApartment() {
    this.selectService.selectAnnounced$
      .pipe(take(1))
      .subscribe( id => {
      this.http.delete(URL + 'apartmentsClasses/' + id.id)
        .subscribe(res => {
          this.snackBar.open('Class has been deleted!', 'Ok',
            {duration: 6000});
          this.selectService.announceSelect(null);
          this.matDialogRef.close();
          this.selectService.announceDelete(1);
        }, error => {
          this.matDialogRef.close();
          this.snackBar.open('Error: '.concat(error.error), 'Ok',
            { duration: 6000});
        });
      });
  }
}



