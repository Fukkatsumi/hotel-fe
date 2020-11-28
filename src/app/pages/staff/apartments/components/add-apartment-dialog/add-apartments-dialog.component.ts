import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Apartments} from '../../../../../component/apartments';
import {HttpClient} from '@angular/common/http';
import {ApartmentsClass} from '../../../../../component/apartments-class';
import {ConstantsService} from '../../../../../services/constants.service';
import {ApartmentStatus} from '../../../../../component/apartment-status.type';
import {MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SelectService} from "../../../../../services/select.service";
import {Unsubscribable} from "../../../../../component/Unsubscribable";

/**
 * @title Dialog with header, scrollable content and actions
 */

const URL = new ConstantsService().BASE_URL;

@Component({
  selector: 'app-add-apartments-dialog',
  styleUrls: ['../../../styles/change-dialog.css'],
  templateUrl: './add-apartments-dialog.html',
})
export class AddApartmentsDialogComponent implements OnInit {

  isError = false;

  constructor(private formBuilder: FormBuilder, private http: HttpClient,
              private dialogRef: MatDialogRef<AddApartmentsDialogComponent>,
              private snackBar: MatSnackBar,
              private selectService: SelectService) {
    this.getAllApartmentsClasses();
  }

  addApartmentForm: FormGroup;

  apartment = {} as Apartments;
  apartmentClass = {} as ApartmentsClass;

  apartmentsClassesList: ApartmentsClass[];
  selectedApartmentsClass: ApartmentsClass;

  statusList = [
    'ReadyToCheckIn',
    'OnRepair',
    'NeedCleaning',
    'Occupied'
  ];

  private selectedApartmentStatus: ApartmentStatus;

  ngOnInit(): void {
    this.addApartmentForm = this.formBuilder.group({
      roomNumber: ['', Validators.pattern('^\\d{1,3}$')],
      photo: ['', Validators.pattern(
        '^(?:http(s)?:\\/\\/)?[\\w.-]+(?:\\.[\\w\\.-]+)+[\\w\\-\\._~:/?#[\\]@!\\$&\'\\(\\)\\*\\+,;=.]+$')],
      description: [''],
      status: [''],
      apartmentClass: [''],
      numberOfRooms: [{value: '', disabled: true}],
      numberOfCouchette: [{value: '', disabled: true}]
    });
  }

  checkValid() {
    this.addApartmentForm.markAllAsTouched();
    console.log('FormGroup: ', this.addApartmentForm.valid);
  }

  isSubmitDisabled(): boolean {
    return !this.addApartmentForm.valid ;
  }

  onSubmit() {
    this.isError = true;
    if (this.addApartmentForm.valid) {
      this.setApartment();
      this.createApartment();
    }
  }

  createApartment() {
    this.http.post(URL + 'apartments', this.apartment).subscribe(
      res => {
        console.log(res);
        this.apartment = (res as Apartments);
        this.isError = false;
        this.snackBar.open('Apartment has been added!', 'Ok',
          {duration: 5000});
        this.selectService.announceAdd(res);
        this.dialogRef.close();
      },
      error => {
        this.isError = false;
        this.snackBar.open('Error: '.concat(error.error), 'Ok',
          {duration: 5000});
      });
  }

  setApartment() {
    this.apartment.apartmentClass = this.selectedApartmentsClass;
    this.apartment.description = this.addApartmentForm.value.description;
    this.apartment.status = this.selectedApartmentStatus;
    this.apartment.photo = this.addApartmentForm.value.photo;
    this.apartment.roomNumber = this.addApartmentForm.value.roomNumber;
    console.log(this.apartment);
  }

  onSelect(apartmentsClass: ApartmentsClass): void {
    this.selectedApartmentsClass = apartmentsClass;
  }

  onSelectStatus(status: any): void {
    this.selectedApartmentStatus = status;
  }

  getAllApartmentsClasses() {
    this.http.get(URL + 'apartmentsClasses').subscribe(res => {
      console.log(res);
      this.apartmentsClassesList = (res as ApartmentsClass[]);
    });
  }
}



