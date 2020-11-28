import {Component, OnInit} from '@angular/core';
import {Unsubscribable} from './component/Unsubscribable';
import {Location} from '@angular/common';
import {HttpService} from './http.service';
import {SelectService} from "./services/select.service";
import {AuthenticationService} from "./modules/authentication/authentication.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [HttpService]
})

export class AppComponent extends Unsubscribable implements OnInit {
  page: string;

  constructor(private location: Location, public selectService: SelectService, private auth: AuthenticationService) {
    super(selectService);
  }

  ngOnInit(): void {
    this.auth.getUser();
    if (this.location.path().includes('task-page')) {
      this.page = 'task-page';
    } else if (this.location.path().includes('manager')) {
      this.page = 'manager';
    } else {
      this.page = 'user';
    }
  }
}

