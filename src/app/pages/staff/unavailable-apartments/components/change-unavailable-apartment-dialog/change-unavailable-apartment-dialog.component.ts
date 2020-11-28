/* tslint:disable:no-trailing-whitespace */
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UnavailableApartment} from '../../../../../component/unavailable-apartment';
import {Apartments} from '../../../../../component/apartments';
import {HttpClient} from '@angular/common/http';
import {ConstantsService} from '../../../../../services/constants.service';
import {DataTransferService} from '../../../../../services/data-transfer.service';
import {Unsubscribable} from '../../../../../component/Unsubscribable';
import {SelectService} from '../../../../../services/select.service';
import {Subscription} from 'rxjs';
import {MatDialog} from '@angular/material';
import {DeleteUnavailableApartmentDialogComponent} from '../delete-unavailable-apartment-dialog/delete-unavailable-apartment-dialog.component';
import {DatePipe} from "@angular/common";
import {MatSnackBar} from "@angular/material/snack-bar";

/**
 * @title Dialog with header, scrollable content and actions
 */

const URL = new ConstantsService().BASE_URL;

@Component({
  selector: 'app-change-unavailable-apartment-dialog',
  styleUrls: ['../../../styles/change-dialog.css'],
  templateUrl: './change-unavailable-apartment-dialog.html',
})
export class ChangeUnavailableApartmentDialogComponent extends Unsubscribable implements OnInit {

  addForm: FormGroup;

  isError = false;
  unavailableApartment = {} as UnavailableApartment;
  subscription: Subscription;

  apartmentsList: Apartments[];
  selectedApartments: Apartments;

  // tslint:disable-next-line:max-line-length
  constructor(public dialog: MatDialog,
              private formBuilder: FormBuilder,
              private http: HttpClient,
              private dataTransfer: DataTransferService,
              public selectService: SelectService,
              private datePipe: DatePipe,
              private snackBar: MatSnackBar) {
    super(selectService);
    this.getAllApartments();
    this.unavailableApartment = dataTransfer.getData();
    console.log(this.unavailableApartment);
  }

  ngOnInit(): void {
    this.addForm = this.formBuilder.group({
      roomNumber: ['', Validators.required], // outputs room number
      causeDescription: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
    this.checkValid();
    this.subscription = this.selectService.selectAnnounced$
      .subscribe(row => {
        console.log(row);
        this.selectedApartments = this.unavailableApartment.apartment;
        this.fillForm(row);
      });
  }

  fillForm(row: UnavailableApartment) {
    this.addForm.setValue({
      startDate: row.startDate,
      endDate: row.endDate,
      causeDescription: row.causeDescription,
      roomNumber: row.apartment.roomNumber
    });
  }

  checkValid() {
    this.addForm.markAllAsTouched();
    console.log('FormGroup: ', this.addForm.valid);
  }

  isSubmitDisabled(): boolean {
    return !this.addForm.valid && this.addForm.value.startDate >= this.addForm.value.endDate;
    //

  }

  onSubmit() {
    this.isError = true;
    if (this.addForm.valid) {
      this.setUnavailableApartment();
      this.createUnavailableApartment();
    }
  }

  setUnavailableApartment() {
    const startDateCleaned = this.datePipe.transform(this.addForm.value.startDate, 'yyyy-MM-dd');
    const endDateCleaned = this.datePipe.transform(this.addForm.value.endDate, 'yyyy-MM-dd');
    this.addForm.patchValue({
      startDate: startDateCleaned,
      endDate: endDateCleaned
    });
    this.unavailableApartment.apartment = this.selectedApartments;
    this.unavailableApartment.startDate = this.addForm.value.startDate;
    this.unavailableApartment.endDate = this.addForm.value.endDate;
    this.unavailableApartment.causeDescription = this.addForm.value.causeDescription;
    console.log(this.unavailableApartment);
  }

  createUnavailableApartment() {
    this.http.put(URL + 'unavailableApartments/' + this.unavailableApartment.id, this.unavailableApartment).subscribe(
      res => {
        console.log(res);
        this.unavailableApartment = (res as UnavailableApartment);
        this.isError = false;
        this.snackBar.open('Unavailable apartment has been changed!', 'Ok', {duration: 8000});
      }, error => {
        this.isError = false;
        this.snackBar.open('Error: '.concat(error.error), 'Ok', {duration: 8000});
      });
  }


  onSelectApartment(apartments: Apartments): void {
    this.selectedApartments = apartments;
  }


  getAllApartments() {
    this.http.get(URL + 'apartments').subscribe(res => {
      console.log(res);
      this.apartmentsList = (res as Apartments[]);
    });
  }


  deleteUnavailableApartment() {
    const dialogRef = this.dialog.open(DeleteUnavailableApartmentDialogComponent,
      {disableClose: true, autoFocus: true});

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}



