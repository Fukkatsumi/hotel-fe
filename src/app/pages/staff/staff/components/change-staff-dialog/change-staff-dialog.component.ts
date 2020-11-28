import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Staff} from '../../../../../component/staff';
import {User} from '../../../../../component/user';
import {DataTransferService} from "../../../../../services/data-transfer.service";
import {ConstantsService} from "../../../../../services/constants.service";
import {Unsubscribable} from "../../../../../component/Unsubscribable";
import {Speciality} from "../../../../../component/speciality.type";
import {Subscription} from "rxjs";
import {SelectService} from "../../../../../services/select.service";
import {MatSnackBar} from "@angular/material/snack-bar";

/**
 * @title Dialog with header, scrollable content and actions
 */

const URL = new ConstantsService().BASE_URL;

@Component({
  selector: 'app-change-staff-dialog',
  styleUrls: ['../../../styles/change-dialog.css'],
  templateUrl: './change-staff-dialog.html',
})
export class ChangeStaffDialogComponent extends Unsubscribable implements OnInit {
  changeStaffFrom: FormGroup;
  staff = {} as Staff;
  user = {} as User;
  subscription: Subscription;
  isError = false;

  specialities = [
    'Cleaner',
    'Handyman',
    'Manager',
    'Hotel_Administrator'
  ];
  selectedSpeciality: Speciality;

  constructor(private formBuilder: FormBuilder, private  http: HttpClient,
              dataTransfer: DataTransferService,
              public selectService: SelectService,
              private snackBar: MatSnackBar) {
    super(selectService);
    this.staff = dataTransfer.getData();
    this.selectedSpeciality = this.staff.speciality;
  }

  ngOnInit(): void {
    this.changeStaffFrom = this.formBuilder.group({
      id: [this.staff.id, Validators.pattern('^\\d{1,4}$')],
      firstname: [{value: this.staff.user.firstname, disabled: true}],
      lastname: [{value: this.staff.user.lastname, disabled: true}],
      active: [this.staff.active],
      speciality: [this.staff.speciality],
    });
    this.checkValid();
    this.subscription = this.selectService.selectAnnounced$
      .subscribe(row => {
        console.log(row);
        this.selectedSpeciality = this.staff.speciality;
        this.staff.active = this.changeStaffFrom.value.active;
        this.staff = row;
        this.fillForm(row);
      });
  }

  fillForm(row: Staff) {
    this.changeStaffFrom.setValue({
      id: row.id,
      firstname: row.user.firstname,
      lastname: row.user.lastname,
      active: row.active,
      speciality: row.speciality
    });
  }


  onSelectSpec(spec: any): void {
    this.selectedSpeciality = spec;
    console.log(this.selectedSpeciality);
  }

  checkValid() {
    this.changeStaffFrom.markAllAsTouched();
    console.log('FormGroup: ', this.changeStaffFrom.valid);
  }

  isSubmitDisabled(): boolean {
    return !this.changeStaffFrom.valid ;
  }

  onSubmit() {
    this.isError = true;
    if (this.changeStaffFrom.valid) {
      this.setStaff();
      this.createStaff();
    }
  }

  createStaff() {
    this.http.put(URL + 'staff/' + this.staff.id, this.staff).subscribe(
      res => {
        console.log(res);
        this.isError = false;
        this.snackBar.open('Staff has been changed!', 'Ok', {duration: 7000});
      }, error => {
        this.isError = false;
        this.snackBar.open('Error: '.concat(error.error), 'Ok', {duration: 7000});
      });
  }

  setStaff() {
    this.staff.active = (this.changeStaffFrom.value.active as boolean);
    this.staff.speciality = this.selectedSpeciality;
    console.log('Staff',  this.staff);
  }
}



