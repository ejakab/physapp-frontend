import { Component, OnInit } from "@angular/core";
import { DataService } from "src/app/services/data.service";
import { Observable, forkJoin, of, from } from "rxjs";
import { Exercise } from "src/app/models/exercise.model";
import { AuthService } from "src/app/services/auth.service";
import { map, take } from "rxjs/operators";

@Component({
  selector: "app-exercises",
  templateUrl: "./exercises.page.html",
  styleUrls: ["./exercises.page.scss"]
})
export class ExercisesPage implements OnInit {
  exercises: Exercise[];
  constructor(
    private dataService: DataService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    console.log("cmon");

    forkJoin([
      this.dataService.exercises.pipe(take(1)),
      this.authService.user.pipe(take(1))
    ]).subscribe(([exercises, user]) => {
      const assignedExercises: Exercise[] = [];
      if (exercises && user) {
        console.log(exercises);
        console.log(user);

        for (const exercise of exercises) {
          if (user && user.assigned && user.assigned.includes(exercise._id)) {
            assignedExercises.push(exercise);
          }
        }
      }
      this.exercises = assignedExercises;
    });
  }

  removeExercise(exercise) {
    let index = this.exercises.indexOf(exercise);

    if (index > -1) {
      this.exercises.splice(index, 1);
    }
  }

  handleSlide(event: any) {
    let ratio = event.detail.ratio;
    if (ratio < 1) {
      console.log("right");
    } else {
      if (ratio > 1) {
        console.log("left");
      }
    }
  }
}
