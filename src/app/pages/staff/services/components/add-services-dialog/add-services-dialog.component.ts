import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {ConstantsService} from '../../../../../services/constants.service';
import {Service} from '../../../../../component/service';
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialogRef} from "@angular/material/dialog";
import {SelectService} from "../../../../../services/select.service";
import {Unsubscribable} from "../../../../../component/Unsubscribable";

/**
 * @title Dialog with header, scrollable content and actions
 */

const URL = new ConstantsService().BASE_URL;

@Component({
  selector: 'app-add-services-dialog',
  styleUrls: ['../../../styles/change-dialog.css'],
  templateUrl: './add-services-dialog.html',
})
export class AddServicesDialogComponent implements OnInit {

  isError = false;
  addServiceForm: FormGroup;
  service = {} as Service;

  constructor(private formBuilder: FormBuilder, private http: HttpClient,
              private snackBar: MatSnackBar,
              private matDialogRef: MatDialogRef<AddServicesDialogComponent>,
              public selectService: SelectService) {
  }

  ngOnInit(): void {
    this.addServiceForm = this.formBuilder.group({
      serviceName: ['', Validators.required],
      price: ['', Validators.pattern('^\\d{1,5}$')]
    });
  }

  checkValid() {
    this.addServiceForm.markAllAsTouched();
    console.log('FormGroup: ', this.addServiceForm.valid);
  }

  isSubmitDisabled(): boolean {
    return !this.addServiceForm.valid;
  }

  onSubmit() {
    this.isError = true;
    if (this.addServiceForm.valid) {
      this.setService();
      this.createService();
    }
  }

  createService() {
    this.http.post(URL + 'bookingAddServices', this.service).subscribe(
      res => {
        console.log(res);
        this.service = (res as Service);
        this.isError = false;
        this.selectService.announceAdd(res);
        this.matDialogRef.close();
        this.snackBar.open('Additional Service has been created!', 'Ok', {duration: 6000});
      }, error => {
        this.isError = false;
        this.snackBar.open(error.error, 'Ok', {duration: 6000});
      });
  }

  setService() {
    this.service.serviceName = this.addServiceForm.value.serviceName;
    this.service.price = this.addServiceForm.value.price;
    console.log(this.service);
  }
}



