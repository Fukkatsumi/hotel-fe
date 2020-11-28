import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Staff} from '../../../../../component/staff';
import {Unsubscribable} from '../../../../../component/Unsubscribable';
import {HttpClient} from '@angular/common/http';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {ConstantsService} from '../../../../../services/constants.service';
import {DataTransferService} from '../../../../../services/data-transfer.service';
import {FormControl} from '@angular/forms';
import {takeUntil} from 'rxjs/operators';
import {SelectService} from '../../../../../services/select.service';
import {Subscription} from "rxjs";

const URL = new ConstantsService().BASE_URL;

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'staff-table-component',
  styleUrls: ['../../../styles/table.css', '../../../styles/first-row-padding-fix.css'],
  templateUrl: 'staff-table.html',
})
export class StaffTableComponent extends Unsubscribable implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  subscription: Subscription;
  subscriptionDelete: Subscription;
  isEmptyTable = false;
  private dataTransfer: DataTransferService;
  selectedRow: any;

  displayedColumns = ['id', 'firstname', 'lastname', 'email', 'speciality', 'active'];
  staffList = new MatTableDataSource<Staff>();

  firstNameFilter = new FormControl('');
  lastNameFilter = new FormControl('');
  emailFilter = new FormControl('');
  specialityFilter = new FormControl('');
  activeFilter = new FormControl('');

  filterValues = {
    id: '',
    firstname: '',
    lastname: '',
    email: '',
    speciality: '',
    active: ''
  };

  constructor(private http: HttpClient, dataTransfer: DataTransferService, public selectService: SelectService) {
    super(selectService);
    this.getAllStaff();
    this.dataTransfer = dataTransfer;
    this.staffList.filterPredicate = this.createFilter();
  }

  selectRow(row: any): void {
    this.selectedRow = row.id;
    console.log(row);
    this.dataTransfer.setData(row);
    this.selectService.announceSelect(row);
  }

  ngOnInit() {
    this.subscription = this.selectService.addAnnounced$
      .subscribe(res => {
        if (res != null) {
          this.isEmptyTable = false;
          this.getAllStaff();
          this.ngAfterViewInit();
          this.selectService.announceAdd(null);
        }
      }, error => {
        console.log(error);
      });
    this.firstNameFilter.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(firstname => {
        this.filterValues.firstname = firstname;
        this.staffList.filter = JSON.stringify(this.filterValues);
        console.log(this.filterValues.firstname);
        }
      );

    this.lastNameFilter.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(lastname => {
        this.filterValues.lastname = lastname;
        this.staffList.filter = JSON.stringify(this.filterValues);
        console.log(this.filterValues.lastname);
        }
      );
    this.emailFilter.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(email => {
        this.filterValues.email = email;
        this.staffList.filter = JSON.stringify(this.filterValues);
        console.log(this.filterValues.email);
        }
      );

    this.specialityFilter.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(speciality => {
        this.filterValues.speciality = speciality;
        this.staffList.filter = JSON.stringify(this.filterValues);
        console.log(this.filterValues.speciality);
        }
      );

    this.activeFilter.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(active => {
        this.filterValues.active = active;
        this.staffList.filter = JSON.stringify(this.filterValues);
        console.log(this.filterValues.active);
        }
      );
  }

  ngAfterViewInit(): void {
    this.staffList.paginator = this.paginator;
  }

  public getAllStaff = () => {
    this.http.get(URL + 'staff').subscribe(res => {
      console.log(res);
      this.staffList.data = (res as Staff[]);
      this.isEmptyTable = true;
    });
  }

  createFilter(): (data: any, filter: string) => boolean {
    // tslint:disable-next-line:only-arrow-functions
    const filterFunction = function (data, filter): boolean {
      const searchTerms = JSON.parse(filter);
      return data.user.lastname.toString().toLowerCase().indexOf(searchTerms.lastname) !== -1
        && data.user.email.toString().toLowerCase().indexOf(searchTerms.email) !== -1
        && data.user.firstname.toString().toLowerCase().indexOf(searchTerms.firstname) !== -1
        && data.speciality.toString().toLowerCase().indexOf(searchTerms.speciality) !== -1
        && data.active.toString().toLowerCase().indexOf(searchTerms.active) !== -1;
    };
    return filterFunction;
  }
}
