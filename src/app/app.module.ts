import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpService} from './http.service';
import {StaffModule} from './pages/staff/staff.module';
import {UserModule} from './pages/user/user.module';
import {JWTInterceptor} from './modules/authentication/jwt.interceptor';
import {TaskPageModule} from "./pages/tasks-page/task-page.module";
import {ConstantsService} from './services/constants.service';
import {AuthenticationService} from "./modules/authentication/authentication.service";


@NgModule({
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    MatButtonModule,
    AppRoutingModule,
    StaffModule,
    UserModule,
    TaskPageModule
  ],
  declarations: [
    AppComponent
  ],
  providers: [
    HttpService,
    AuthenticationService,
    ConstantsService,
    {provide: HTTP_INTERCEPTORS, useClass: JWTInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
