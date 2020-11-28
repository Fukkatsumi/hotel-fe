/* tslint:disable:no-trailing-whitespace */
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApartmentPrice} from '../../../../../component/apartment-price';
import {ApartmentsClass} from '../../../../../component/apartments-class';
import {HttpClient} from '@angular/common/http';
import {ConstantsService} from '../../../../../services/constants.service';
import {DataTransferService} from '../../../../../services/data-transfer.service';
import {Unsubscribable} from '../../../../../component/Unsubscribable';
import {SelectService} from '../../../../../services/select.service';
import {Subscription} from 'rxjs';
import {MatDialog} from '@angular/material';
import {DeleteApartmentPricesDialogComponent} from '../delete-apartment-prices-dialog/delete-apartment-prices-dialog.component';
import {DatePipe} from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';

/**
 * @title Dialog with header, scrollable content and actions
 */

const URL = new ConstantsService().BASE_URL;

@Component({
  selector: 'app-change-booking-dialog',
  styleUrls: ['../../../styles/change-dialog.css'],
  templateUrl: './change-apartment-prices-dialog.html',
})
export class ChangeApartmentPricesDialogComponent extends Unsubscribable implements OnInit {
  isError = false;
  addForm: FormGroup;

  apartmentPrice = {} as ApartmentPrice;
  subscription: Subscription;

  apartmentsClassesList: ApartmentsClass[];
  selectedApartmentsClass: ApartmentsClass;

  // tslint:disable-next-line:max-line-length
  constructor(public dialog: MatDialog,
              private formBuilder: FormBuilder,
              private http: HttpClient,
              private dataTransfer: DataTransferService,
              public selectService: SelectService,
              private datePipe: DatePipe,
              private snackBar: MatSnackBar) {
    super(selectService);
    this.getAllApartmentsClasses();
    this.apartmentPrice = dataTransfer.getData();
    console.log(this.apartmentPrice);
  }

  ngOnInit(): void {
    this.addForm = this.formBuilder.group({
      nameClass: ['', Validators.required],
      price: ['', Validators.pattern('(\\d+)')],
      startPeriod: ['', Validators.required],
      endPeriod: ['', Validators.required]
    });
    this.checkValid();
    this.subscription = this.selectService.selectAnnounced$
      .subscribe(row => {
        console.log(row);
        this.selectedApartmentsClass = this.apartmentPrice.apartmentClass;
        this.fillForm(row);
      });
  }

  fillForm(row: ApartmentPrice) {
    this.addForm.setValue({
      startPeriod: row.startPeriod,
      endPeriod: row.endPeriod,
      price: row.price,
      nameClass: row.apartmentClass.nameClass,
    });
  }

  checkValid() {
    this.addForm.markAllAsTouched();
    console.log('FormGroup: ', this.addForm.valid);
  }

  isSubmitDisabled(): boolean {
    return !this.addForm.valid;
  }

  onSubmit() {
    this.isError = true;
    if (this.addForm.valid) {
      this.setApartmentPrice();
      this.createApartmentPrice();
    }
  }

  createApartmentPrice() {
    this.http.put(URL + 'apartmentPrices/' + this.apartmentPrice.id, this.apartmentPrice).subscribe(
      res => {
        this.apartmentPrice = (res as ApartmentPrice);
        this.isError = false;
        this.snackBar.open('Class price has been changed!', 'Ok',
          {duration: 5000});
      },
      error => {
        this.isError = false;
        this.snackBar.open('Error: '.concat(error.error), 'Ok',
          { duration: 5000 }); });
  }

  setApartmentPrice() {
    const startDateCleaned = this.datePipe.transform(this.addForm.value.startPeriod, 'yyyy-MM-dd');
    const endDateCleaned = this.datePipe.transform(this.addForm.value.endPeriod, 'yyyy-MM-dd');
    this.addForm.patchValue({
      startPeriod: startDateCleaned,
      endPeriod: endDateCleaned
    });
    this.apartmentPrice.apartmentClass = this.selectedApartmentsClass;
    this.apartmentPrice.startPeriod = this.addForm.value.startPeriod;
    this.apartmentPrice.endPeriod = this.addForm.value.endPeriod;
    this.apartmentPrice.price = this.addForm.value.price;
    console.log(this.apartmentPrice);
  }

  onSelectAprtmntClass(apartmentsClass: ApartmentsClass): void {
    this.selectedApartmentsClass = apartmentsClass;
  }


  getAllApartmentsClasses() {
    this.http.get(URL + 'apartmentsClasses').subscribe(res => {
      console.log(res);
      this.apartmentsClassesList = (res as ApartmentsClass[]);
    });
  }


  deleteApartmentPrice() {
    const dialogRef = this.dialog.open(DeleteApartmentPricesDialogComponent,
      {disableClose: true, autoFocus: true});

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}



