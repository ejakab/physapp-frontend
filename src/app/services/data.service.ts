import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment.prod";
import { map, distinctUntilChanged } from "rxjs/operators";
import { User } from "../models/user.model";
import { Exercise } from "../models/exercise.model";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class DataService {
  private _url = environment.url;
  private _exercises = new BehaviorSubject<Exercise[]>(null);

  constructor(private http: HttpClient) {
    this.getExercises()
      .pipe(distinctUntilChanged())
      .subscribe(ex => {
        if (ex) {
            this._exercises.next(ex);
        }
      });
  }
  get exercises() {
    return this._exercises.asObservable();
  }
  getExercises(): Observable<Exercise[]> {
    return this.http.get(this._url + "/api/get-exercises").pipe(
      map((exercises: Exercise[]) => {
        return exercises;
      })
    );
  }
  getUsers(): Observable<User[]> {
    return this.http.get(this._url + "/api/get-users").pipe(
      map((users: User[]) => {
        return users;
      })
    );
  }
}
