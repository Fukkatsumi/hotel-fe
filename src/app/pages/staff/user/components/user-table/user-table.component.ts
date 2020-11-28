import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {Unsubscribable} from '../../../../../component/Unsubscribable';
import {HttpClient} from '@angular/common/http';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {FormControl} from '@angular/forms';
import {ConstantsService} from '../../../../../services/constants.service';
import {DataTransferService} from '../../../../../services/data-transfer.service';
import {User} from '../../../../../component/user';
import {SelectService} from "../../../../../services/select.service";

const URL = new ConstantsService().BASE_URL;

/**
 * @title Table with sticky header
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'user-table-component',
  styleUrls: ['../../../styles/table.css'],
  templateUrl: 'user-table.html',
})
export class UserTableComponent extends Unsubscribable implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  isEmptyTable = false;
  private dataTransfer: DataTransferService;
  selectedRow: any;
  usersList = new MatTableDataSource<User>();
  displayedColumns = ['login', 'userRole', 'firstname', 'lastname', 'email', 'phoneNumber', 'points'];

  loginFilter = new FormControl('');
  userRoleFilter = new FormControl('');
  firstNameFilter = new FormControl('');
  lastNameFilter = new FormControl('');
  emailFilter = new FormControl('');
  phoneNumberFilter = new FormControl('');
  pointsFilter = new FormControl('');

  filterValues = {
    login: '',
    userRole: '',
    firstname: '',
    lastname: '',
    email: '',
    phoneNumber: '',
    points: ''
  };


  constructor(private http: HttpClient, dataTransfer: DataTransferService, public selectService: SelectService) {
    super(selectService);
    this.getAllApartmentsClasses();
    this.dataTransfer = dataTransfer;
    this.usersList.filterPredicate = this.createFilter();
  }

  selectRow(row: any): void {
    this.selectedRow = row.login;
    console.log(row);
    this.dataTransfer.setData(row);
  }

  ngOnInit() {
    this.loginFilter.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(
        login => {
          this.filterValues.login = login;
          this.usersList.filter = JSON.stringify(this.filterValues);
        }
      );
    this.userRoleFilter.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(
        userRole => {
          this.filterValues.userRole = userRole;
          this.usersList.filter = JSON.stringify(this.filterValues);
        }
      );
    this.firstNameFilter.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(
        firstname => {
          this.filterValues.firstname = firstname;
          this.usersList.filter = JSON.stringify(this.filterValues);
        }
      );
    this.lastNameFilter.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(
        lastname => {
          this.filterValues.lastname = lastname;
          this.usersList.filter = JSON.stringify(this.filterValues);
        }
      );
    this.emailFilter.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(
        email => {
          this.filterValues.email = email;
          this.usersList.filter = JSON.stringify(this.filterValues);
        }
      );
    this.phoneNumberFilter.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(
        phoneNumber => {
          this.filterValues.phoneNumber = phoneNumber;
          this.usersList.filter = JSON.stringify(this.filterValues);
        }
      );
    this.pointsFilter.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(
        points => {
          this.filterValues.points = points;
          this.usersList.filter = JSON.stringify(this.filterValues);
        }
      );
  }

  ngAfterViewInit(): void {
    this.usersList.paginator = this.paginator;
  }

  public getAllApartmentsClasses = () => {
    this.http.get(URL + 'users/').subscribe(res => {
      console.log(res);
      this.usersList.data = (res as User[]);
      this.isEmptyTable = true;
    });
  }

  createFilter(): (data: any, filter: string) => boolean {
    let filterFunction = function (data, filter): boolean {
      let searchTerms = JSON.parse(filter);
      return data.login.toString().toLowerCase().indexOf(searchTerms.login) !== -1
        && data.userRole.toString().toLowerCase().indexOf(searchTerms.userRole) !== -1
        && data.firstname.toString().toLowerCase().indexOf(searchTerms.firstname) !== -1
        && data.lastname.toString().toLowerCase().indexOf(searchTerms.lastname) !== -1
        && data.email.toString().toLowerCase().indexOf(searchTerms.email) !== -1
        && data.phoneNumber.toString().toLowerCase().indexOf(searchTerms.phoneNumber) !== -1
        && data.points.toString().toLowerCase().indexOf(searchTerms.points) !== -1;
    };
    return filterFunction;
  }
}
