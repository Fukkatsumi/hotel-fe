import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {MatButtonModule, MatFormFieldModule, MatInputModule, MatPaginatorModule} from '@angular/material';
import {MatSelectModule} from '@angular/material/select';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTableModule} from '@angular/material/table';
import {HttpClientModule} from '@angular/common/http';
import {HttpService} from '../../../http.service';
import {ReactiveFormsModule} from '@angular/forms';
import {UserManagerComponent} from './user-manager.component';
import {UserTableComponent} from './components/user-table/user-table.component';
import {AnimationsModule} from "../../../modules/animations/animations.module";

@NgModule({
    imports: [
        MatPaginatorModule,
        BrowserModule,
        HttpClientModule,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        MatTableModule,
        MatDialogModule,
        MatInputModule,
        ReactiveFormsModule,
        AnimationsModule
    ],
  exports: [
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatPaginatorModule,
    MatSelectModule,
    MatTableModule
  ],
  declarations: [
    UserManagerComponent,
    UserTableComponent
  ],
  providers: [HttpService]
})
export class UserManagerModule {
}
