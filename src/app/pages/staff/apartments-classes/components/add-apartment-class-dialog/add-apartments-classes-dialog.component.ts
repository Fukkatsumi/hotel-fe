import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {ApartmentsClass} from '../../../../../component/apartments-class';
import {ConstantsService} from '../../../../../services/constants.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialogRef} from "@angular/material/dialog";
import {SelectService} from "../../../../../services/select.service";

/**
 * @title Dialog with header, scrollable content and actions
 */

const URL = new ConstantsService().BASE_URL;

@Component({
  selector: 'app-add-apartments-classes-dialog',
  styleUrls: ['../../../styles/change-dialog.css'],
  templateUrl: './add-apartments-classes-dialog.html',
})
export class AddApartmentsClassesDialogComponent implements OnInit {
  isError = false;
  addApartmentClassForm: FormGroup;
  apartmentClass = {} as ApartmentsClass;

  constructor(private formBuilder: FormBuilder, private http: HttpClient,
              private snackBar: MatSnackBar,
              private matDialogRef: MatDialogRef<AddApartmentsClassesDialogComponent>,
              private selectService: SelectService) {
  }

  ngOnInit(): void {
    this.addApartmentClassForm = this.formBuilder.group({
      className: ['', Validators.required],
      numberOfRooms: ['', Validators.pattern('^\\d{1}$')],
      numberOfCouchette: ['', Validators.pattern('^\\d{1}$')]
    });
  }

  checkValid() {
    this.addApartmentClassForm.markAllAsTouched();
    console.log('FormGroup: ', this.addApartmentClassForm.valid);
  }

  isSubmitDisabled(): boolean {
    return !this.addApartmentClassForm.valid;
  }

  onSubmit() {
    this.isError = true;
    if (this.addApartmentClassForm.valid) {
      this.setApartment();
      this.createApartment();
    }
  }

  createApartment() {
    this.http.post(URL + 'apartmentsClasses', this.apartmentClass).subscribe(
      res => {
        console.log(res);
        this.apartmentClass = (res as ApartmentsClass);
        this.snackBar.open('Class has been added', 'Ok',
          {duration: 5000});
        this.isError = false;
        this.selectService.announceAdd(res);
        this.matDialogRef.close();
      }, error => {
        this.isError = false;
        this.snackBar.open('Error: '.concat(error.error), 'Ok',
          {duration: 5000});
      });
  }

  setApartment() {
    this.apartmentClass.nameClass = this.addApartmentClassForm.value.className;
    this.apartmentClass.numberOfRooms = this.addApartmentClassForm.value.numberOfRooms;
    this.apartmentClass.numberOfCouchette = this.addApartmentClassForm.value.numberOfCouchette;
    console.log(this.apartmentClass);
  }
}



