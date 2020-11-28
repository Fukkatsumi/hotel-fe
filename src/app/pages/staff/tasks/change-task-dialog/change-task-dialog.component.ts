import {ConstantsService} from "../../../../services/constants.service";
import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {HttpClient} from "@angular/common/http";
import {DataTransferService} from "../../../../services/data-transfer.service";
import {Task} from "../../../../component/task";
import {Staff} from "../../../../component/staff";
import {Apartments} from "../../../../component/apartments";
import {SelectService} from "../../../../services/select.service";
import {TaskStatus} from "../../../../component/task-status.type";
import {MatSnackBar} from "@angular/material/snack-bar";

/**
 * @title Dialog with header, scrollable content and actions
 */

const URL = new ConstantsService().BASE_URL;


@Component({
  selector: 'app-change-task-dialog',
  templateUrl: './change-task-dialog.html',
  styleUrls: ['../../styles/change-dialog.css'],
})
export class ChangeTaskDialogComponent implements OnInit {

  isSubmit = false;
  changeForm: FormGroup;
  task = {} as Task;
  taskStatus = [
    'OPEN',
    'Started',
    'Complete',
    'Failed',
    'Canceled'
  ];
  staffList: Staff[];
  selectedCreator: Staff;
  selectedExecutor: Staff;
  apartmentList: Apartments[];
  selectedApartment: Apartments;
  selectedStatus: TaskStatus;


  constructor(public dialog: MatDialog, private formBuilder: FormBuilder,
              private http: HttpClient,
              dataTransfer: DataTransferService, public selectService: SelectService,
              private snackBar: MatSnackBar) {
    this.task = dataTransfer.getData();
    this.getAllApartment();
    this.getAllAStaff();
    console.log(this.task);
  }

  ngOnInit(): void {
    this.changeForm = this.formBuilder.group({
      start: [this.task.start,
        Validators.pattern('^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]$')],
      end: [this.task.end,
        Validators.pattern('^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]$')],
      accept: [this.task.accept,
        Validators.pattern('^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]$')],
      complete: [this.task.complete,
        Validators.pattern('^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]$')],
      description: [this.task.description, Validators.required],
      taskStatus: [this.task.status, Validators.required],
      apartment: [this.task.apartment, Validators.required],
      creator: [this.task.creator, Validators.required],
      executor: [this.task.executor, Validators.required],
      apartmentsRoomNumber: [this.task.apartment.roomNumber],
      creatorEmail: [this.task.creator.user.email],
      executorEmail: [this.task.executor.user.email]
    });
    this.checkValid();
    this.selectService.selectAnnounced$
      .subscribe(row => {
        console.log(row);
        this.getAllApartment();
        this.task = row;
        this.fillForm(row);
      });
  }

  fillForm(row: Task) {
    this.changeForm.setValue({
      start: row.start,
      end: row.end,
      accept: row.accept,
      complete: row.complete,
      description: row.description,
      taskStatus: row.status,
      apartment: row.apartment,
      creator: row.creator,
      executor: row.executor,
      apartmentsRoomNumber: row.apartment.roomNumber,
      creatorEmail: row.creator.user.email,
      executorEmail: row.executor.user.email
    });
    this.onSelectApartment(row.apartment);
    this.onSelectCreator(row.creator);
    this.onSelectExecutor(row.executor);
  }

  checkValid() {
    this.changeForm.markAllAsTouched();
    console.log('FormGroup: ', this.changeForm.valid);
  }

  isSubmitDisabled(): boolean {
    return !this.changeForm.valid;
  }

  onSubmit() {
    this.isSubmit = true;
    if (this.changeForm.valid) {
      this.setTask();
      this.changeTask();
    }
  }

  changeTask() {
    this.http.put(URL + 'tasks/' + this.task.id, this.task).subscribe(
      res => {
        console.log(res);
        this.task = (res as Task);
        this.isSubmit = false;
        this.snackBar.open('Task has been changed!', 'Ok', { duration: 5000});
      }, error => {
        this.isSubmit = false;
        this.snackBar.open('Error: '.concat(error.error), 'Ok', { duration: 5000});
      });
  }

  setTask() {
    this.task.creator = this.selectedCreator;
    this.task.executor = this.selectedExecutor;
    this.task.apartment = this.selectedApartment;
    this.task.start = this.changeForm.value.start;
    this.task.end = this.changeForm.value.end;
    this.task.accept = this.changeForm.value.accept;
    this.task.complete = this.changeForm.value.complete;
    this.task.description = this.changeForm.value.description;
    this.task.status = this.changeForm.value.taskStatus;
    console.log(this.task);
  }

  getAllAStaff() {
    this.http.get(URL + 'staff').subscribe(res => {
      console.log(res);
      this.staffList = (res as Staff[]);
    });
  }

  getAllApartment() {
    this.http.get(URL + 'apartments').subscribe(res => {
      console.log(res);
      this.apartmentList = (res as Apartments[]);
    });
  }

  onSelectCreator(staff: Staff): void {
    this.selectedCreator = staff;
  }

  onSelectExecutor(staff: Staff): void {
    this.selectedExecutor = staff;
  }

  onSelectApartment(apartment: Apartments): void {
    this.selectedApartment = apartment;
  }

  onSelectTaskStatus(status: any): void {
    this.selectedStatus = status;
  }
}
