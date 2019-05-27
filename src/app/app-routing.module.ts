import { AuthGuardService } from './services/auth-guard.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
 
const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  {
    path: 'inside',
    loadChildren: './pages/inside/inside.module#InsidePageModule', // we don't want users to access pages only by url
    canActivate: [AuthGuardService] // automatic check to see if they can access the page or not
  },
  { path: 'home', 
    loadChildren: './pages/inside/home/home.module#HomePageModule',
    canActivate: [AuthGuardService]
  },
  {
    path: "exercises",
    loadChildren: "./pages/inside/exercises/exercises.module#ExercisesPageModule",
    canActivate: [AuthGuardService]
  },
  {
    path: "progress",
    loadChildren:
      "./pages/inside/progress/progress.module#ProgressPageModule",
    canActivate: [AuthGuardService]
  },
  {
    path: "profile",
    loadChildren: "./pages/inside/profile/profile.module#ProfilePageModule",
    canActivate: [AuthGuardService]
  },

];
 
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }