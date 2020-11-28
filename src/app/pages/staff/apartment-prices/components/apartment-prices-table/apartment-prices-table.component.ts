import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {Unsubscribable} from '../../../../../component/Unsubscribable';
import {HttpClient} from '@angular/common/http';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {ApartmentPrice} from '../../../../../component/apartment-price';
import {ConstantsService} from '../../../../../services/constants.service';
import {FormControl} from '@angular/forms';
import {DataTransferService} from '../../../../../services/data-transfer.service';
import {SelectService} from "../../../../../services/select.service";
import {Subscription} from "rxjs";


const URL = new ConstantsService().BASE_URL;

/**
 * @title Table with sticky header
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'apartment-prices-table-component',
  styleUrls: ['../../../styles/table.css', '../../../styles/first-row-padding-fix.css'],
  templateUrl: 'apartment-prices-table.html',
})
export class ApartmentPricesTableComponent extends Unsubscribable implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  subscription: Subscription;
  subscriptionDelete: Subscription;
  isEmptyTable = false;
  private dataTransfer: DataTransferService;
  selectedRow: any;
  apartmentPricesList = new MatTableDataSource<ApartmentPrice>();
  selectedApartmentPrice: ApartmentPrice;
  displayedColumns = ['id', 'nameClass', 'price', 'startPeriod', 'endPeriod'];
  dataSource = this.apartmentPricesList;
  totalPriceFilter = new FormControl('');
  startDateFilter = new FormControl('');
  endDateFilter = new FormControl('');
  apartmentClassFilter = new FormControl('');

  filterValues = {
    price: '',
    startPeriod: '',
    endPeriod: '',
    nameClass: ''
  };

  constructor(private http: HttpClient, dataTransfer: DataTransferService, public selectService: SelectService) {
    super(selectService);
    this.getAllApartmentPrices();
    this.dataTransfer = dataTransfer;
    this.apartmentPricesList.filterPredicate = this.createFilter();
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
          this.getAllApartmentPrices();
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
          this.getAllApartmentPrices();
          this.ngAfterViewInit();
          this.selectService.announceDelete(null);
        }
      });

    this.totalPriceFilter.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(
        price => {
          this.filterValues.price = price;
          this.apartmentPricesList.filter = JSON.stringify(this.filterValues);
        }
      );
    this.startDateFilter.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(
        startPeriod => {
          this.filterValues.startPeriod = startPeriod;
          this.apartmentPricesList.filter = JSON.stringify(this.filterValues);
        }
      );
    this.endDateFilter.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(
        endPeriod => {
          this.filterValues.endPeriod = endPeriod;
          this.apartmentPricesList.filter = JSON.stringify(this.filterValues);
        }
      );
    this.apartmentClassFilter.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(
        nameClass => {
          this.filterValues.nameClass = nameClass;
          this.apartmentPricesList.filter = JSON.stringify(this.filterValues);
        }
      );
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  public getAllApartmentPrices = () => {
    this.http.get(URL + 'apartmentPrices/').subscribe(res => {
      console.log(res);
      this.isEmptyTable = true;
      this.dataSource.data = (res as ApartmentPrice[]);
    });
  }

  createFilter(): (data: any, filter: string) => boolean {
    // tslint:disable-next-line:only-arrow-functions
    const filterFunction = function (data, filter): boolean {
      const searchTerms = JSON.parse(filter);
      let result = data.startPeriod.toString().toLowerCase().indexOf(searchTerms.startPeriod) !== -1
        && data.endPeriod.toString().toLowerCase().indexOf(searchTerms.endPeriod) !== -1
        && data.price.toString().toLowerCase().indexOf(searchTerms.price) !== -1
        && data.apartmentClass.nameClass.toString().toLowerCase().indexOf(searchTerms.nameClass) !== -1;
      return result;
    };
    return filterFunction;
  }

}
