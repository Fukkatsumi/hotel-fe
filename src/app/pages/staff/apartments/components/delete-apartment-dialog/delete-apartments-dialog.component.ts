import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Apartments} from '../../../../../component/apartments';
import {HttpClient} from '@angular/common/http';
import {ApartmentsClass} from '../../../../../component/apartments-class';
import {ConstantsService} from '../../../../../services/constants.service';
import {DataTransferService} from '../../../../../services/data-transfer.service';
import {take} from "rxjs/operators";
import {SelectService} from "../../../../../services/select.service";
import {MatSnackBar} from "@angular/material/snack-bar";


/**
 * @title Dialog with header, scrollable content and actions
 */

const URL = new ConstantsService().BASE_URL;

@Component({
  selector: 'app-delete-apartments-dialog',
  styleUrls: ['../../../styles/change-dialog.css'],
  templateUrl: './delete-apartments-dialog.html',
})
export class DeleteApartmentsDialogComponent {

  constructor(private http: HttpClient, private selectService: SelectService,
              private snackBar: MatSnackBar) {
  }

  deleteApartment() {
    this.selectService.selectAnnounced$
      .pipe(take(1))
      .subscribe( id => {
        this.http.delete(URL + 'apartments/' + id.id)
          .subscribe(res => {
            this.snackBar.open('Apartment has been deleted!', 'Ok',
              {duration: 6000});
            this.selectService.announceSelect(null);
            this.selectService.announceDelete(1);
          }, error => {
        this.snackBar.open('Error: '.concat(error.error), 'Ok',
          { duration: 6000});
      });
      });
  }
}



