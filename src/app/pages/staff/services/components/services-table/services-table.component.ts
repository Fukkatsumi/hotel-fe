import {AfterViewInit, ChangeDetectorRef, Component, Injectable, OnInit, ViewChild} from '@angular/core';
import {take, takeUntil} from 'rxjs/operators';
import {Unsubscribable} from '../../../../../component/Unsubscribable';
import {HttpClient} from '@angular/common/http';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {FormControl} from '@angular/forms';
import {ConstantsService} from '../../../../../services/constants.service';
import {DataTransferService} from '../../../../../services/data-transfer.service';
import {Service} from '../../../../../component/service';
import {SelectService} from "../../../../../services/select.service";
import {DataSource} from "@angular/cdk/collections";
import {Subscription} from "rxjs";

const URL = new ConstantsService().BASE_URL;

/**
 * @title Table with sticky header
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'services-table-component',
  styleUrls: ['../../../styles/table.css', '../../../styles/first-row-padding-fix.css'],
  templateUrl: 'services-table.html',
})
@Injectable({
  providedIn: 'root'
})
export class ServicesTableComponent extends Unsubscribable implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  isEmptyTable = false;
  private dataTransfer: DataTransferService;
  selectedRow: any;
  servicesList = new MatTableDataSource<Service>();
  displayedColumns = ['id', 'serviceName', 'price'];
  subscription: Subscription;
  subscriptionDelete: Subscription;

  serviceNameFilter = new FormControl('');
  priceFilter = new FormControl('');

  filterValues = {
    id: '',
    serviceName: '',
    price: ''
  };


  constructor(private http: HttpClient, dataTransfer: DataTransferService, public selectService: SelectService) {
    super(selectService);
    this.getAllApartmentsClasses();
    this.dataTransfer = dataTransfer;
    this.servicesList.filterPredicate = this.createFilter();
  }

  selectRow(row: any): void {
    this.selectedRow = row.id;
    console.log(row);
    this.dataTransfer.setData(row);
    this.selectService.announceSelect(row);
  }

  ngOnInit(): void {
    this.subscription = this.selectService.addAnnounced$
      .subscribe(res => {
        if (res != null) {
          this.isEmptyTable = false;
          this.getAllApartmentsClasses();
          this.ngAfterViewInit();
          this.selectService.announceAdd(null);
          // console.log('SelectService', res);
          // this.http.get(URL + 'bookingAddServices/' + res.toString())
          //   .subscribe(response => {
          //     const service = response as Service;
          //     this.servicesList.data.push(service);
          //     console.log('get by id', response);
          //     const serviceTempList = new MatTableDataSource<Service>();
          //     serviceTempList.data = this.servicesList.data;
          //     this.servicesList = new MatTableDataSource<Service>();
          //     this.servicesList.data = serviceTempList.data;
          //     this.ngAfterViewInit();
          //     this.selectService.announceAdd(null);
          //   });
        }
      }, error => {
        console.log(error);
      });
    this.subscriptionDelete = this.selectService.deleteAnnounced$
      .subscribe(res => {
        if (res != null) {
          this.isEmptyTable = false;
          console.log('SelectService', res);
          this.getAllApartmentsClasses();
          this.ngAfterViewInit();
          this.selectService.announceDelete(null);
        }
      });

    this.serviceNameFilter.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(
        serviceName => {
          this.filterValues.serviceName = serviceName;
          this.servicesList.filter = JSON.stringify(this.filterValues);
        }
      );
    this.priceFilter.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(
        price => {
          this.filterValues.price = price;
          this.servicesList.filter = JSON.stringify(this.filterValues);
        }
      );

  }

  ngAfterViewInit(): void {
    this.servicesList.paginator = this.paginator;
  }

  public getAllApartmentsClasses = () => {
    this.http.get(URL + 'bookingAddServices/').subscribe(res => {
      console.log(res);
      this.servicesList.data = (res as Service[]);
      this.isEmptyTable = true;
    });
  }

  createFilter(): (data: any, filter: string) => boolean {
    let filterFunction = function (data, filter): boolean {
      let searchTerms = JSON.parse(filter);
      return data.serviceName.toLowerCase().indexOf(searchTerms.serviceName) !== -1
        && data.price.toString().toLowerCase().indexOf(searchTerms.price) !== -1;
    };
    return filterFunction;
  }
}
