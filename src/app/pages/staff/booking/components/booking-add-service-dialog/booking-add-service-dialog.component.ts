import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {take, takeUntil} from 'rxjs/operators';
import {Unsubscribable} from '../../../../../component/Unsubscribable';
import {HttpClient} from '@angular/common/http';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {BookingAddServiceShip} from '../../../../../component/booking-add-service-ship';
import {ConstantsService} from '../../../../../services/constants.service';
import {DataTransferService} from '../../../../../services/data-transfer.service';
import {SelectService} from '../../../../../services/select.service';
import {FormControl} from '@angular/forms';


const URL = new ConstantsService().BASE_URL;

/**
 * @title Table with sticky header
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'booking-add-service-dialog-component',
  styleUrls: ['../../../styles/table.css', '../../../styles/first-row-padding-fix.css'],
  templateUrl: 'booking-add-service-dialog.html',
})
export class BookingAddServiceDialogComponent extends Unsubscribable implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  private dataTransfer: DataTransferService;
  bookingAddServiceShipList = new MatTableDataSource<BookingAddServiceShip>();
  displayedColumns = [
    'id',
    'serviceName',
    'price',
    'countServices'
  ];
  dataSource = this.bookingAddServiceShipList;
  serviceNameFilter = new FormControl('');
  priceFilter = new FormControl('');
  countServicesFilter = new FormControl('');

  filterValues = {
    serviceName: '',
    price: '',
    countServices: ''
  };

  constructor(private http: HttpClient, dataTransfer: DataTransferService, public selectService: SelectService) {
    super(selectService);
    this.getServiceShips();
    this.dataTransfer = dataTransfer;
    this.bookingAddServiceShipList.filterPredicate = this.createFilter();
  }

  ngOnInit() {
    this.serviceNameFilter.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(
        serviceName => {
          this.filterValues.price = serviceName;
          this.bookingAddServiceShipList.filter = JSON.stringify(this.filterValues);
        }
      );
    this.priceFilter.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(
        price => {
          this.filterValues.price = price;
          this.bookingAddServiceShipList.filter = JSON.stringify(this.filterValues);
        }
      );
    this.countServicesFilter.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(
        countServices => {
          this.filterValues.countServices = countServices;
          this.bookingAddServiceShipList.filter = JSON.stringify(this.filterValues);
        }
      );
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  public getServiceShips = () => {
    this.selectService.selectAnnounced$
      .pipe(take(1))
      .subscribe(id => {
        this.http.get(URL + 'bookingAddServicesShip?booking=' + id.id).subscribe(res => {
          console.log('booking add services list' + res)
          this.dataSource.data = (res as BookingAddServiceShip[]);
        });
      });
  }

  createFilter(): (data: any, filter: string) => boolean {
    // tslint:disable-next-line:only-arrow-functions
    const filterFunction = function (data, filter): boolean {
      const searchTerms = JSON.parse(filter);
      const result = data.bookingAddServices.serviceName.toString().toLowerCase().indexOf(searchTerms.serviceName) !== -1
        && data.bookingAddServices.price.toString().toLowerCase().indexOf(searchTerms.price) !== -1
        && data.countServices.toString().toLowerCase().indexOf(searchTerms.countServices) !== -1;
      return result;
    };
    return filterFunction;
  }

}
