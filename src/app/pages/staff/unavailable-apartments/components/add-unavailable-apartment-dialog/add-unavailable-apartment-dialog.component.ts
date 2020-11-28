import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Apartments} from '../../../../../component/apartments';
import {ConstantsService} from '../../../../../services/constants.service';
import {UnavailableApartment} from '../../../../../component/unavailable-apartment';
import {Subscription} from 'rxjs';
import {SelectService} from '../../../../../services/select.service';
import {Unsubscribable} from '../../../../../component/Unsubscribable';
import {DatePipe} from "@angular/common";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialogRef} from "@angular/material/dialog";

/**
 * @title Dialog with header, scrollable content and actions
 */

const URL = new ConstantsService().BASE_URL;

@Component({
  selector: 'app-add-unavailable-apartment-dialog',
  styleUrls: ['../../../styles/change-dialog.css'],
  templateUrl: './add-unavailable-apartment-dialog.html',
})
export class AddUnavailableApartmentDialogComponent implements OnInit {

  addForm: FormGroup;
  isError = false;
  unavailableApartment = {} as UnavailableApartment;
  subscription: Subscription;


  apartmentsList: Apartments[];
  selectedApartment: Apartments;

  constructor(private formBuilder: FormBuilder,
              private http: HttpClient,
              public selectService: SelectService,
              private datePipe: DatePipe,
              private snackBar: MatSnackBar,
              private matDialogRef: MatDialogRef<AddUnavailableApartmentDialogComponent>) {
    this.getAllApartments();
  }

  ngOnInit(): void {
    this.addForm = this.formBuilder.group({
      apartment: ['', Validators.required],
      causeDescription: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });

    this.checkValid();
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
      this.setUnavailableApartment();
    }
  }

  setUnavailableApartment() {
    const startDateCleaned = this.datePipe.transform(this.addForm.value.startDate, 'yyyy-MM-dd');
    const endDateCleaned = this.datePipe.transform(this.addForm.value.endDate, 'yyyy-MM-dd');
    this.addForm.patchValue({
      startDate: startDateCleaned,
      endDate: endDateCleaned
    });
    this.unavailableApartment.apartment = this.selectedApartment;
    this.unavailableApartment.startDate = this.addForm.value.startDate;
    this.unavailableApartment.endDate = this.addForm.value.endDate;
    this.unavailableApartment.causeDescription = this.addForm.value.causeDescription;
    this.createUnavailableApartment();
  }

  onSelectApartment(apartments: Apartments): void {
    this.selectedApartment = apartments;
    console.log(this.selectedApartment);
  }

  getAllApartments() {
    this.http.get(URL + 'apartments').subscribe(res => {
      console.log(res);
      this.apartmentsList = (res as Apartments[]);
    });
  }

  createUnavailableApartment() {
    this.http.post(URL + 'unavailableApartments/', this.unavailableApartment).subscribe(
      res => {
        console.log(res);
        this.unavailableApartment = (res as UnavailableApartment);
        this.isError = false;
        this.matDialogRef.close();
        this.selectService.announceAdd(res);
        this.snackBar.open('Unavailable apartment has been added!', 'Ok', { duration: 6000});
      },
      error => {
        this.isError = false;
        this.snackBar.open('Error: '.concat(error.error), 'Ok', { duration: 6000});
      });
  }
}



