import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { AuthGuardService } from "src/app/services/auth-guard.service";
import { InsidePage } from "./inside.page";

const routes: Routes = [
  {
    path: "inside",
    component: InsidePage,
    children: [
      {
        path: "home",
        loadChildren: "./home/home.module#HomePageModule",
        canActivate: [AuthGuardService]
      },
      {
        path: "exercises",
        loadChildren: "./exercises/exercises.module#ExercisesPageModule",
        canActivate: [AuthGuardService]
      },
      {
        path: "progress",
        loadChildren:
          "./progress/progress.module#ProgressPageModule",
        canActivate: [AuthGuardService]
      },
      {
        path: "profile",
        loadChildren: "./profile/profile.module#ProfilePageModule",
        canActivate: [AuthGuardService]
      }
    ]
  },
  {
    path: "",
    redirectTo: "inside/home",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InsideRoutingModule {}
