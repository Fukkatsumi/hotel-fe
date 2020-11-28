/* tslint:disable:no-trailing-whitespace */
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {Unsubscribable} from '../../../../../component/Unsubscribable';
import {HttpClient} from '@angular/common/http';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {UnavailableApartment} from '../../../../../component/unavailable-apartment';
import {ConstantsService} from '../../../../../services/constants.service';
import {FormControl} from '@angular/forms';
import {DataTransferService} from '../../../../../services/data-transfer.service';
import {SelectService} from '../../../../../services/select.service';
import {Subscription} from "rxjs";


const URL = new ConstantsService().BASE_URL;

/**
 * @title Table with sticky header
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'unavailable-apartments-table-component',
  styleUrls: ['../../../styles/table.css', '../../../styles/first-row-padding-fix.css'],
  templateUrl: 'unavailable-apartments-table.html',
})
export class UnavailableApartmentsTableComponent extends Unsubscribable implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  isEmptyTable = false;
  private dataTransfer: DataTransferService;
  selectedRow: any;
  unavailableApartmentList = new MatTableDataSource<UnavailableApartment>();
  displayedColumns = ['id', 'roomNumber', 'startDate', 'endDate', 'causeDescription'];
  dataSource = this.unavailableApartmentList;
  startDateFilter = new FormControl('');
  endDateFilter = new FormControl('');
  causeDescriptionFilter = new FormControl('');
  apartmentFilter = new FormControl('');
  subscription: Subscription;
  subscriptionDelete: Subscription;

  filterValues = {
    id: '',
    startDate: '',
    endDate: '',
    causeDescription: '',
    roomNumber: ''
  };

  constructor(private http: HttpClient, dataTransfer: DataTransferService, public selectService: SelectService) {
    super(selectService);
    this.getAllUnavailableApartments();
    this.dataTransfer = dataTransfer;
    this.unavailableApartmentList.filterPredicate = this.createFilter();
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
          this.getAllUnavailableApartments();
          this.ngAfterViewInit();
          this.selectService.announceAdd(null);
        }
      }, error => {
        console.log(error);
      });
    this.subscriptionDelete = this.selectService.deleteAnnounced$
      .subscribe(res => {
        if (res != null) {
          this.isEmptyTable = false;
          this.getAllUnavailableApartments();
          this.ngAfterViewInit();
          this.selectService.announceDelete(null);
        }
      });

    this.startDateFilter.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(
        startDate => {
          this.filterValues.startDate = startDate;
          this.unavailableApartmentList.filter = JSON.stringify(this.filterValues);
        }
      );
    this.endDateFilter.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(
        endDate => {
          this.filterValues.endDate = endDate;
          this.unavailableApartmentList.filter = JSON.stringify(this.filterValues);
        }
      );
    this.causeDescriptionFilter.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(
        causeDescription => {
          this.filterValues.causeDescription = causeDescription;
          this.unavailableApartmentList.filter = JSON.stringify(this.filterValues);
        }
      );
    this.apartmentFilter.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(
        roomNumber => {
          this.filterValues.roomNumber = roomNumber;
          this.unavailableApartmentList.filter = JSON.stringify(this.filterValues);
        }
      );
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  public getAllUnavailableApartments = () => {
    this.http.get(URL + 'unavailableApartments/').subscribe(res => {
      console.log(res);
      this.dataSource.data = (res as UnavailableApartment[]);
      this.isEmptyTable = true;
    });
  }

  createFilter(): (data: any, filter: string) => boolean {
    // tslint:disable-next-line:only-arrow-functions
    const filterFunction = function (data, filter): boolean {
      const searchTerms = JSON.parse(filter);
      let result = data.startDate.toString().toLowerCase().indexOf(searchTerms.startDate) !== -1
        && data.endDate.toString().toLowerCase().indexOf(searchTerms.endDate) !== -1
        && data.causeDescription.toString().toLowerCase().indexOf(searchTerms.causeDescription) !== -1
        && data.apartment.roomNumber.toString().toLowerCase().indexOf(searchTerms.roomNumber) !== -1;
      return result;
    };
    return filterFunction;
  }

}
