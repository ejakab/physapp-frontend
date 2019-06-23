import { Injectable } from "@angular/core";
import { DataService } from "./data.service";
import { AuthService } from "./auth.service";
import { DizzyLog } from "../models/dizzyLog.model";
import { switchMap, filter, take } from "rxjs/operators";
import { User } from "../models/user.model";

@Injectable({ providedIn: "root" })
export class LogService {
  constructor(
    private dataService: DataService,
    private authService: AuthService
  ) {}
  addDizzyLog(log: DizzyLog) {
    this.authService.user
      .pipe(
        filter(user => !!user),
        take(1),
        switchMap(user => {
          const body = { ...log, email: user.email };
          return this.dataService.addDizzyLog(body);
        })
      )
      .subscribe(
        (res: { updatedUser: User; res: any }) => {            
          this.authService.updateUser(res.updatedUser);
        },
        err => console.log(err)
      );
  }
}
