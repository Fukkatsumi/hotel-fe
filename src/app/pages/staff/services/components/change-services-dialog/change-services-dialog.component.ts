import {Component, Injectable, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {ConstantsService} from '../../../../../services/constants.service';
import {DataTransferService} from '../../../../../services/data-transfer.service';
import {Service} from '../../../../../component/service';
import {Unsubscribable} from "../../../../../component/Unsubscribable";
import {SelectService} from "../../../../../services/select.service";
import {Subscription} from "rxjs";
import {DeleteServicesDialogComponent} from "../delete-services-dialog/delete-services-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";

/**
 * @title Dialog with header, scrollable content and actions
 */

const URL = new ConstantsService().BASE_URL;

@Component({
  selector: 'app-change-services-dialog',
  styleUrls: ['../../../styles/change-dialog.css'],
  templateUrl: './change-services-dialog.html',
})
@Injectable({
  providedIn: 'root'
})
export class ChangeServicesDialogComponent extends Unsubscribable implements OnInit {

  changeForm: FormGroup;
  service = {} as Service;
  subscription: Subscription;
  isError = false;

  constructor(private formBuilder: FormBuilder, private http: HttpClient,
              dataTransfer: DataTransferService,
              public dialog: MatDialog,
              public selectService: SelectService,
              private snackBar: MatSnackBar) {
    super(selectService);
    this.service = dataTransfer.getData();
    console.log(this.service);
  }

  ngOnInit(): void {
    this.changeForm = this.formBuilder.group({
      serviceName: [this.service.serviceName, Validators.required],
      price: ['', Validators.pattern('^\\d{1,5}$')]
    });
    this.checkValid();
    this.subscription = this.selectService.selectAnnounced$
      .subscribe(row => {
        console.log(row);
        this.service = row;
        this.fillForm(row);
      });
  }

  fillForm(row: Service) {
    this.changeForm.setValue({
      serviceName: row.serviceName,
      price: row.price
    });
  }

  checkValid() {
    this.changeForm.markAllAsTouched();
    console.log('FormGroup: ', this.changeForm.valid);
  }

  isSubmitDisabled(): boolean {
    return !this.changeForm.valid;
  }

  onSubmit() {
    this.isError = true;
    if (this.changeForm.valid) {
      this.setService();
      this.changeService();
    }
  }

  changeService() {
    this.http.put(URL + 'bookingAddServices/' + this.service.id, this.service).subscribe(
      res => {
        console.log(res);
        this.service = (res as Service);
        this.isError = false;
        this.snackBar.open('Additional service has been changed!', 'Ok', {duration: 6000});
      }, error => {
        this.isError = false;
        this.snackBar.open(error.error, 'Ok', {duration: 6000});
      });
  }

  setService() {
    this.service.serviceName = this.changeForm.value.serviceName;
    this.service.price = this.changeForm.value.price;
    console.log(this.service);
  }


  deleteDialog() {
    const dialogRef = this.dialog.open(DeleteServicesDialogComponent,
      {disableClose: true, autoFocus: true});

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}



