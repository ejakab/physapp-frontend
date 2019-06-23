import { Component, OnInit } from "@angular/core";
import { combineLatest } from "rxjs";
import { Exercise } from "src/app/models/exercise.model";
import { AuthService } from "src/app/services/auth.service";
import { ExerciseService } from "src/app/services/exercise.service";

@Component({
  selector: "app-exercises",
  templateUrl: "./exercises.page.html",
  styleUrls: ["./exercises.page.scss"]
})
export class ExercisesPage implements OnInit {
  exercises: Exercise[];
  isLoading = true;
  constructor(
    private exerciseService: ExerciseService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    combineLatest(
      this.exerciseService.exercises,
      this.authService.user
    ).subscribe(([exercises, user]) => {
      const assignedExercises: Exercise[] = [];
      if (!exercises || !user) {
        return;
      }
      for (const exercise of exercises) {
        if (user && user.excercises && user.excercises.includes(exercise._id)) {
          assignedExercises.push(exercise);
        }
      }
      const today = new Date().toDateString();
      assignedExercises.forEach(assex => {});
      const leftToComplete: Exercise[] = assignedExercises.filter(e1 => {
        if (!user.completed || user.completed.length === 0) {
          return e1;
        } else {
          return user.completed.some(e2 => {
            if (
              e2.exerciseId === e1._id &&
              today === new Date(e2.date).toDateString()
            ) {
              return false;
            }
            if (
              e2.exerciseId !== e1._id &&
              today === new Date(e2.date).toDateString() &&
              !user.completed.some(x => x.exerciseId === e1._id)
            ) {
              return true;
            }
            if (
              e2.exerciseId === e1._id &&
              today !== new Date(e2.date).toDateString() &&
              !user.completed.some(
                x =>
                  x.exerciseId === e2.exerciseId &&
                  new Date(x.date).toDateString() === today
              )
            ) {
              return true;
            }
            if (
              e2.exerciseId !== e1._id &&
              today !== new Date(e2.date).toDateString() &&
              !user.completed.some(x => x.exerciseId === e1._id)
            ) {
              return true;
            }
          });
        }
      });
      console.log(assignedExercises.length);
      console.log(leftToComplete.length);
      this.exercises = leftToComplete;
      this.isLoading = false;
    });
  }

  onCompleteExercise(exercise: Exercise, liked: boolean): void {
    this.exerciseService.completeExercise(exercise, liked);
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

  removeExercise(exercise) {
    let index = this.exercises.indexOf(exercise);

    if (index > -1) {
      this.exercises.splice(index, 1);
    }
  }
}
