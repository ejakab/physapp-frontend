import { Injectable } from "@angular/core";
import { DataService } from "./data.service";
import { BehaviorSubject, Observable, of, from } from "rxjs";
import { Exercise } from "../models/exercise.model";
import {
  distinctUntilChanged,
  map,
  switchMap,
  take,
  filter
} from "rxjs/operators";
import { AuthService, UpdatedUser } from "./auth.service";
import { User } from '../models/user.model';

@Injectable({ providedIn: "root" })
export class ExerciseService {
  private _exercises = new BehaviorSubject<Exercise[]>(null);

  constructor(
    private dataService: DataService,
    private authService: AuthService
  ) {
    dataService
      .fetchAllExercises()
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

  completeExercise(exercise: Exercise, liked: boolean) {
    this.authService.user
      .pipe(
        take(1),
        filter(user => !!user && !!user.email),
        switchMap(user => {
          const body = {
            email: user.email,
            name: exercise.name,
            exerciseId: exercise._id,
            date: new Date(),
            liked: liked
          };
          return this.dataService.addCompletedExercise(body);
        })
      )
      .subscribe(
        (res: { updatedUser: User; res: any }) => {
          this.authService.updateUser(res.updatedUser as User)
          console.log(res);
        },
        error => {
          console.log(error);
        }
      );
  }
}
