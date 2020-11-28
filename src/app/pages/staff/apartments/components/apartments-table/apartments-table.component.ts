import {AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {Unsubscribable} from '../../../../../component/Unsubscribable';
import {HttpClient} from '@angular/common/http';
import {Apartments} from '../../../../../component/apartments';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {FormControl} from '@angular/forms';
import {ConstantsService} from '../../../../../services/constants.service';
import {DataTransferService} from "../../../../../services/data-transfer.service";
import {SelectService} from "../../../../../services/select.service";
import {Subscription} from "rxjs";

const URL = new ConstantsService().BASE_URL;

/**
 * @title Table with sticky header
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'apartments-table-component',
  styleUrls: ['../../../styles/table.css', 'apartments-table.component.css'],
  templateUrl: 'apartments-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApartmentsTableComponent extends Unsubscribable implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  subscription: Subscription;
  subscriptionDelete: Subscription;

  isEmptyTable = false;
  private dataTransfer: DataTransferService;
  selectedRow: any;
  apartmentsList = new MatTableDataSource<Apartments>();
  selectedApartments: Apartments;
  displayedColumns = ['roomNumber', 'photo', 'description', 'status',
    'apartmentClass.nameClass', 'apartmentClass.numberOfRooms', 'apartmentClass.numberOfCouchette'];

  roomNumberFilter = new FormControl('');
  photoFilter = new FormControl('');
  descriptionFilter = new FormControl('');
  statusFilter = new FormControl('');
  nameClassFilter = new FormControl('');
  numberOfRoomsFilter = new FormControl('');
  numberOfCouchetteFilter = new FormControl('');

  filterValues = {
    roomNumber: '',
    photo: '',
    description: '',
    status: '',
    nameClass: '',
    numberOfRooms: '',
    numberOfCouchette: ''
  };


  constructor(private http: HttpClient, dataTransfer: DataTransferService, public selectService: SelectService) {
    super(selectService);
    this.subscription = this.selectService.selectAnnounced$.subscribe();
    this.getAllApartments();
    this.dataTransfer = dataTransfer;
    this.apartmentsList.filterPredicate = this.createFilter();
  }

  selectRow(row: any): void {
    this.selectedRow = row.id;
    console.log(row);
    this.dataTransfer.setData(row);
    this.selectService.announceSelect(row);
  }

  onSelect(apartments: Apartments): void {
    this.selectedApartments = apartments;
    console.log(this.selectedApartments);
  }

  ngOnInit(): void {
    this.subscription = this.selectService.addAnnounced$
      .subscribe(res => {
        if (res != null) {
          this.isEmptyTable = false;
          this.getAllApartments();
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
          this.getAllApartments();
          this.ngAfterViewInit();
          this.selectService.announceDelete(null);
        }
      });

    this.roomNumberFilter.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(
        roomNumber => {
          this.filterValues.roomNumber = roomNumber;
          this.apartmentsList.filter = JSON.stringify(this.filterValues);
        }
      );
    this.photoFilter.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(
        photo => {
          this.filterValues.photo = photo;
          this.apartmentsList.filter = JSON.stringify(this.filterValues);
        }
      );
    this.descriptionFilter.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(
        description => {
          this.filterValues.description = description;
          this.apartmentsList.filter = JSON.stringify(this.filterValues);
        }
      );
    this.statusFilter.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(
        status => {
          this.filterValues.status = status;
          this.apartmentsList.filter = JSON.stringify(this.filterValues);
        }
      );
    this.nameClassFilter.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(
        nameClass => {
          this.filterValues.nameClass = nameClass;
          this.apartmentsList.filter = JSON.stringify(this.filterValues);
        }
      );
    this.numberOfRoomsFilter.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(
        numberOfRooms => {
          this.filterValues.numberOfRooms = numberOfRooms;
          this.apartmentsList.filter = JSON.stringify(this.filterValues);
        }
      );
    this.numberOfCouchetteFilter.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(
        numberOfCouchette => {
          this.filterValues.numberOfCouchette = numberOfCouchette;
          this.apartmentsList.filter = JSON.stringify(this.filterValues);
        }
      );
  }

  ngAfterViewInit(): void {
    this.apartmentsList.paginator = this.paginator;
  }

  public getAllApartments = () => {
    this.http.get(URL + 'apartments').subscribe(res => {
      console.log(res);
      this.apartmentsList.data = (res as Apartments[]);
      this.isEmptyTable = true;
    });
  }

  createFilter(): (data: any, filter: string) => boolean {
    // tslint:disable-next-line:only-arrow-functions
    let filterFunction = function(data, filter): boolean {
      let searchTerms = JSON.parse(filter);
      return data.roomNumber.toString().toLowerCase().indexOf(searchTerms.roomNumber) !== -1
        && data.photo.toLowerCase().indexOf(searchTerms.photo) !== -1
        && data.description.indexOf(searchTerms.description) !== -1
        && data.status.toString().toLowerCase().indexOf(searchTerms.status) !== -1
        && data.apartmentClass.numberOfCouchette.toString().toLowerCase().indexOf(searchTerms.numberOfCouchette) !== -1
        && data.apartmentClass.numberOfRooms.toString().toLowerCase().indexOf(searchTerms.numberOfRooms) !== -1
        && data.apartmentClass.nameClass.toString().toLowerCase().indexOf(searchTerms.nameClass) !== -1;
    };
    return filterFunction;
  }
}
