import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Apartments} from '../../../../../component/apartments';
import {ApartmentsClass} from '../../../../../component/apartments-class';
import {HttpClient} from '@angular/common/http';
import {ConstantsService} from '../../../../../services/constants.service';
import {Unsubscribable} from '../../../../../component/Unsubscribable';
import {DataTransferService} from '../../../../../services/data-transfer.service';
import {Subscription} from "rxjs";
import {SelectService} from "../../../../../services/select.service";
import {DeleteApartmentsDialogComponent} from "../delete-apartment-dialog/delete-apartments-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {ApartmentStatus} from "../../../../../component/apartment-status.type";
import {MatSnackBar} from "@angular/material/snack-bar";

/**
 * @title Dialog with header, scrollable content and actions
 */

const URL = new ConstantsService().BASE_URL;

@Component({
  selector: 'app-change-apartments-dialog',
  styleUrls: ['../../../styles/change-dialog.css'],
  templateUrl: './change-apartments-dialog.html',
})

export class ChangeApartmentsDialogComponent extends Unsubscribable implements OnInit {
  isSubmit = false;
  profileForm: FormGroup;
  apartment = {} as Apartments;
  apartmentClass = {} as ApartmentsClass;

  apartmentsClassesList: ApartmentsClass[];
  selectedApartmentsClass: ApartmentsClass;
  subscription: Subscription;

  statusList = [
    'ReadyToCheckIn',
    'OnRepair',
    'NeedCleaning',
    'Occupied'
  ];

  private selectedApartmentStatus: ApartmentStatus;

  constructor(public dialog: MatDialog,
              private formBuilder: FormBuilder,
              private http: HttpClient,
              dataTransfer: DataTransferService,
              public selectService: SelectService,
              private snackBar: MatSnackBar) {
    super(selectService);
    this.apartment = dataTransfer.getData();
    this.getAllApartmentsClasses();
  }

  ngOnInit(): void {
    this.profileForm = this.formBuilder.group({
      id: [this.apartment.id, Validators.pattern('^\\d{1,4}$')],
      roomNumber: [this.apartment.roomNumber, Validators.pattern('^\\d{1,3}$')],
      photo: [this.apartment.photo, Validators.pattern(
        '^(?:http(s)?:\\/\\/)?[\\w.-]+(?:\\.[\\w\\.-]+)+[\\w\\-\\._~:/?#[\\]@!\\$&\'\\(\\)\\*\\+,;=.]+$')],
      description: [this.apartment.description],
      status: [this.apartment.status],
      nameClass: [this.apartment.apartmentClass.nameClass]
    });
    this.checkValid();
    this.subscription = this.selectService.selectAnnounced$
      .subscribe(row => {
        this.apartment = row;
        this.selectedApartmentsClass = this.apartment.apartmentClass;
        this.selectedApartmentStatus = this.apartment.status;
        this.fillForm(row);
      });
  }

  fillForm(row: Apartments) {
    this.profileForm.setValue({
      id: row.id,
      roomNumber: row.roomNumber,
      photo:  row.photo,
      description: row.description,
      status: row.status,
      nameClass: row.apartmentClass.nameClass
    });
  }

  checkValid() {
    this.profileForm.markAllAsTouched();
    console.log('FormGroup: ', this.profileForm.valid);
  }

  isSubmitDisabled(): boolean {
    return !this.profileForm.valid ;
  }

  onSubmit() {
    this.isSubmit = true;
    if (this.profileForm.valid) {
      this.setApartment();
      this.createApartment();
    }
  }

  createApartment() {
    this.http.put(URL + 'apartments/' + this.apartment.id, this.apartment).subscribe(
      res => {
        console.log(res);
        this.apartment = (res as Apartments);
        this.isSubmit = false;
        this.snackBar.open('Apartment has been changed!', 'Ok', {duration: 5000});
      }, error => {
        this.isSubmit = false;
        this.snackBar.open('Error: '.concat(error.error), 'Ok', {duration: 5000});
      });
  }

  deleteApartment() {
    const dialogRef = this.dialog.open(DeleteApartmentsDialogComponent,
      {disableClose: true, autoFocus: true});

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  setApartment() {
    this.apartment.apartmentClass = this.selectedApartmentsClass;
    this.apartment.description = this.profileForm.value.description;
    this.apartment.status = this.selectedApartmentStatus;
    this.apartment.photo = this.profileForm.value.photo;
    this.apartment.roomNumber = this.profileForm.value.roomNumber;
    this.apartment.id = this.profileForm.value.id;
    console.log(this.apartment);
  }

  onSelect(apartmentsClass: ApartmentsClass): void {
    this.selectedApartmentsClass = apartmentsClass;
  }

  onSelectStatus(status: any): void {
    this.selectedApartmentStatus = status;
  }

  getAllApartmentsClasses() {
    this.http.get(URL + 'apartmentsClasses/').subscribe(res => {
      console.log(res);
      this.apartmentsClassesList = (res as ApartmentsClass[]);
    });
  }

}



