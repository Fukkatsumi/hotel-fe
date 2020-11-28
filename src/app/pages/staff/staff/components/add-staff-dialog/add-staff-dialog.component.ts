import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Staff} from '../../../../../component/staff';
import {User} from '../../../../../component/user';
import {ConstantsService} from '../../../../../services/constants.service';
import {Roles} from "../../../../../component/roles.type";
import {Speciality} from "../../../../../component/speciality.type";
import {templateJitUrl} from "@angular/compiler";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialogRef} from "@angular/material/dialog";
import {SelectService} from "../../../../../services/select.service";

/**
 * @title Dialog with header, scrollable content and actions
 */
const URL = new ConstantsService().BASE_URL;

@Component({
  selector: 'app-add-staff-dialog',
  styleUrls: ['../../../styles/change-dialog.css'],
  templateUrl: './add-staff-dialog.html',
})
export class AddStaffDialogComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private  http: HttpClient,
              private snackBar: MatSnackBar,
              private matDialogRef: MatDialogRef<AddStaffDialogComponent>,
              private selectService: SelectService) {
  }

  isError = false;
  addStaffFrom: FormGroup;
  staff = {} as Staff;
  user = {} as User;
  roles = [
    'Manager',
    'Administrator',
    'Client',
    'Worker'
  ];
  private selectedRole: Roles;
  specialities = [
    'Cleaner',
    'Handyman',
    'Manager',
    'Hotel_Administrator'
  ];
  private selectedSpeciality: Speciality;

  ngOnInit(): void {
    this.addStaffFrom = this.formBuilder.group({
      firstname: ['', Validators.pattern('^([A-Z]){1}([a-z]+)$')],
      lastname: ['', Validators.pattern('^([A-Z]){1}([a-z]+)$')],
      email: ['', Validators.pattern('^[a-zA-Z0-9.!#$%&’*+=?^_`{|}~-]+\\@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-]+$')],
      phoneNumber: ['', Validators.pattern('(^\\+{1}\\d{7,13}$)|(^\\d{7,13}$)')],
      login: ['', Validators.pattern('^([a-zA-Z])\\S+$')],
      password: ['', Validators.pattern('^\\S{1,20}$')],
      role: ['', Validators.required],
      active: ['true'],
      speciality: ['', Validators.required],
    });
  }

  checkValid() {
    this.addStaffFrom.markAllAsTouched();
    console.log('FormGroup: ', this.addStaffFrom.valid);
  }

  isSubmitDisabled(): boolean {
    return !this.addStaffFrom.valid ;
  }

  onSubmit() {
    this.isError = true;
    if (this.addStaffFrom.valid) {
      console.log(this.addStaffFrom.value);
      this.setStaff();
      this.createStaff();
    }
  }

  onSelectRole(roles: any): void {
    this.selectedRole = roles;
    console.log(this.selectedRole);
  }

  onSelectSpec(spec: any): void {
    this.selectedSpeciality = spec;
    console.log(this.selectedSpeciality);
  }

  createStaff() {
    this.http.post(URL + 'staff', this.staff).subscribe(
      res => {
        console.log(res);
        this.staff = (res as Staff);
        this.isError = false;
        this.matDialogRef.close();
        this.selectService.announceAdd(res);
        this.snackBar.open('Staff has been created!', 'Ok', {duration: 6000});
      }, error => {
        this.isError = false;
        this.snackBar.open(error.error, 'Ok', {duration: 6000});
      });
  }

  setStaff() {
    this.user.firstname = this.addStaffFrom.value.firstname;
    this.user.lastname = this.addStaffFrom.value.lastname;
    this.user.login = this.addStaffFrom.value.login;
    this.user.password = this.addStaffFrom.value.password;
    this.user.email = this.addStaffFrom.value.email;
    this.user.phoneNumber = this.addStaffFrom.value.phoneNumber;
    this.user.userRole = this.selectedRole;
    this.staff.user = this.user;
    this.staff.active = this.addStaffFrom.value.active;
    this.staff.speciality = this.selectedSpeciality;
    console.log(this.staff);
  }
}



