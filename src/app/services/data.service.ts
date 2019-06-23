import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment.prod";
import { map, distinctUntilChanged } from "rxjs/operators";
import { User } from "../models/user.model";
import { Exercise } from "../models/exercise.model";
import { BehaviorSubject, Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { DizzyLog } from "../models/dizzyLog.model";
interface CompletedExerciseBody {
  email: string;
  exerciseId: string;
  date: Date;
  liked?: boolean;
}
@Injectable({ providedIn: "root" })
export class DataService {
  private _url = environment.url;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get(this._url + "/api/get-users").pipe(
      map((users: User[]) => {
        return users;
      })
    );
  }
  fetchAllExercises(): Observable<Exercise[]> {
    return this.http.get(this._url + "/api/get-exercises").pipe(
      map((exercises: Exercise[]) => {
        return exercises;
      })
    );
  }
  addCompletedExercise(body: CompletedExerciseBody): Observable<Object> {
    return this.http.post(`${this._url}/api/add-completed-exercise`, body).pipe(
      map(resp => {
        return resp;
      })
    );
  }
  addDizzyLog(body: DizzyLog): Observable<Object> {
    return this.http.post(`${this._url}/api/add-dizzy-log`, body).pipe(
      map(resp => {
        return resp;
      })
    );
  }
}
