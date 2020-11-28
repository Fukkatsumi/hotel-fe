import {Injectable, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';
import {User} from '../../component/user';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {ConstantsService} from "../../services/constants.service";

const BASE_URL = new ConstantsService().BASE_URL;

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  private tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  public currentUser: Observable<User> = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.tokenSubject.next(localStorage.getItem('token'));
  }

  public getUser() {
    if (this.tokenSubject.value !== null) {
      this.http.get(BASE_URL + 'users/current')
        .subscribe(
          (user: User) => {
            this.currentUserSubject.next(user);
          });
    }
  }

  public get currentUserObservable(): Observable<User> {
    return this.currentUser;
  }

  public get currentUserObject(): User {
    return this.currentUserSubject.value;
  }

  token(): string {
    return this.tokenSubject.value;
  }

  login(username: string, password: string): Observable<any> {
    // Codes
    // 0 - waiting
    // 1 - correct
    // 2 - error
    const isRespounseCorrect = new Subject<number>();
    isRespounseCorrect.next(0);

  
    const response = this.http.get(BASE_URL + 'authenticate?'
      + 'username=' + username
      + '&password=' + password);
    response.subscribe(
      data => {
          if (data.hasOwnProperty('token')) {
            const tok = (data as {token});
            this.tokenSubject.next(tok.token);
            localStorage.setItem('token', tok.token);
            if (isNotNullOrUndefined(tok)) {
              this.http.get(BASE_URL + 'users?login=' + username)
                .subscribe(
                  resp => {
                    this.currentUserSubject.next((resp as User));
                    isRespounseCorrect.next(1);
                });
            }
          }
      },
      err => {
        isRespounseCorrect.next(2);
      }
    );
    return isRespounseCorrect;
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.tokenSubject.next(null);
  }

  registration(user: User): Observable<any> {

    const errorField = new Subject<string>();
    errorField.next(null);

    this.http.post(BASE_URL + 'users', user)
      .subscribe(data => {
          console.log(data);
          this.login(user.login, user.password);
        },
        err => {
          console.log(err);
          const fields = err.error.match(/\(\w+\)/g);
          if (fields) {
            let f = fields[0].replace(/[()]/g, '');
            errorField.next(f);
          }
        });
    return errorField.asObservable();
  }
}
