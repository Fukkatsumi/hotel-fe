import {Component} from '@angular/core';
import {AuthenticationService} from '../../modules/authentication/authentication.service';
import {Task} from '../../component/task';
import {HttpClient} from '@angular/common/http';
import {TaskStatus} from '../../component/task-status.type';
import {ConstantsService} from '../../services/constants.service';
import {User} from '../../component/user';


const BASE_URL = new ConstantsService().BASE_URL;


@Component({
  selector: 'app-task-page',
  templateUrl: './task-page.component.html',
  styleUrls: ['./task-page.component.css']
})
export class TaskPageComponent {

  logged = false;
  canAccess = false;
  username: string;
  workerTasks: Task[];

  constructor(private auth: AuthenticationService, private http: HttpClient) {
    this.auth.currentUserObservable
      .subscribe(
        (user: User) => {
          this.logged = user !== null;
          if (this.logged) {
            this.username = user.firstname + ' ' + user.lastname;
            this.canAccess = user.userRole === 'Manager' || user.userRole === 'Administrator' || user.userRole === 'Worker';
          }
          this.getTasks();
        }
      );
  }

  accept(id: number) {
    this.changeTaskStatus(id, 'Started');
  }

  cancel(id: number) {
    this.changeTaskStatus(id, 'Canceled');
  }

  finish(id: number) {
    this.changeTaskStatus(id, 'Complete');
  }

  changeTaskStatus(id: number, newStatus: string) {
    this.http.patch(BASE_URL + 'tasks/' + id, {status: newStatus})
      .subscribe(
        data => {
          this.workerTasks
            .find((v: Task, i: number, obj: Task[]) => {
              return v.id === id;
            }).status = (newStatus as TaskStatus);
        },
        error1 => {
          console.log(error1);
        }
      );
  }

  getTasks() {
    if (this.canAccess) {
      this.http.get(BASE_URL + 'tasks?executor=' + this.auth.currentUserObject.id)
        .subscribe(
          (data: Task[]) => {
            this.workerTasks = data
              .sort((a: Task, b: Task) => {
                return a.end === b.end ? 0 : a.end > b.end ? -1 : 1;
              });
          },
          error1 => {
            console.log(error1);
          }
        );
    }
  }

  logout() {
    this.auth.logout();
  }
}
