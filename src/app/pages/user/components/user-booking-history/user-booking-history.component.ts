import {Component, OnInit} from '@angular/core';
import {Booking} from '../../../../component/booking';
import {HttpClient} from '@angular/common/http';
import {AuthenticationService} from '../../../../modules/authentication/authentication.service';
import {Form, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {ConstantsService} from '../../../../services/constants.service';
import {BookingAddService} from '../../../../component/bookingAddService';


const BASE_URL = new ConstantsService().BASE_URL;

@Component({
  selector: 'app-user-booking-history',
  templateUrl: './user-booking-history.component.html',
  styleUrls: ['./user-booking-history.component.css'],
  providers: [DatePipe]
})
export class UserBookingHistoryComponent implements OnInit {

  currentDate = this.dp.transform(new Date(), 'yyy-MM-dd');
  userBookingsHistory: BookingWithServices[];
  reviewForms: ReviewForm[] = [];

  constructor(private http: HttpClient, private authService: AuthenticationService, private fb: FormBuilder, private dp: DatePipe) {
  }

  ngOnInit(): void {
    this.getBookings();
  }

  deleteBooking(id: number) {
    this.http.delete(BASE_URL + 'bookings/' + id)
      .subscribe(
        data => {
          this.getBookings();
        },
        error1 => {
          console.log(error1);
        }
      );
  }

  getBookings() {
    this.http.get(BASE_URL + 'bookings?user=' + this.authService.currentUserObject.id)
      .subscribe(
        (data: Booking[]) => {
            data = data.sort((a: Booking, b: Booking) => {
              return a.startDate === b.startDate ? 0 : (a.startDate > b.startDate ? -1 : 1);
            });
            data.filter((val) => {
              return val.bookingStatus !== 'Created';
            });
            this.userBookingsHistory = [];
            data.forEach((val, i, ref) => {

              if (this.dp.transform(val.endDate, 'yyyy-MM-dd') < this.currentDate && val.review === null) {
                this.reviewForms[i] = new ReviewForm();
                this.reviewForms[i].id = val.id;
                this.reviewForms[i].text = '';
                this.reviewForms[i].errors = new ReviewErrors();
              }

              this.userBookingsHistory[i] = new BookingWithServices();
              this.userBookingsHistory[i].booking = val;
              this.userBookingsHistory[i].services = [];
              this.getServicesByBookingId(val.id, i);
          });
        },
        err => {
          console.log(err);
        }
      );
  }

  getServicesByBookingId(id: number, index: number) {
    this.http.get(BASE_URL + 'bookingAddServicesShip?booking=' + id)
      .subscribe(
        (data: BookingAddServicesWithCount[]) => {
          data.forEach((val, i, ref) => {
            this.userBookingsHistory[index].services[i] = val;
          });
        }
      );
  }

  sendReview(id: number) {
    console.log(this.reviewForms[id]);
    const rev = this.reviewForms[id];
    if (!rev.valid)
      return;
    this.http.patch(BASE_URL + 'bookings/' + rev.id, {review: this.reviewForms[id].text})
      .subscribe(
        data => {
          this.getBookings();
        },
        error1 => {
          console.log(error1);
        }
      );
  }

  validateReview(index: number): boolean {
    const rev = this.reviewForms[index];
    const text = rev.text;
    if (text === null) {
      rev.valid = false;
      return false;
    }
    const errors = rev.errors;
    errors.maxLength = text.length > 300;
    errors.minLength = text.length < 10;
    const re = /^(\w|\d| |-|\.|,)+$/g;
    errors.pattern = text.match(re) === null;
    rev.valid = !rev.errors.minLength && !rev.errors.maxLength && !rev.errors.pattern;
  }



}

class BookingAddServicesWithCount {
  bookingAddServices: BookingAddService;
  count: number;
}

class BookingWithServices {
  booking: Booking;
  services: BookingAddServicesWithCount[];
}

class ReviewForm {
  id: number;
  text: string;
  errors: ReviewErrors;
  valid: boolean;
}

class ReviewErrors {
  pattern: boolean;
  minLength: boolean;
  maxLength: boolean;
}
