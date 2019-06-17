import { AuthService } from "../../../services/auth.service";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Storage } from "@ionic/storage";
import { ToastController } from "@ionic/angular";
import { Subscription } from "rxjs";
import { User } from "src/app/models/user.model";
import { DataService } from "src/app/services/data.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"]
})
export class HomePage implements OnInit, OnDestroy {
  data: any;
  userSub: Subscription;
  user: User;
  constructor(
    private authService: AuthService,
    private storage: Storage,
    private toastController: ToastController,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe((user: User) => {
      if (user) {
        this.user = user;
      }
    });
  }

  loadSpecialInfo() {
    this.authService.getSpecialData().subscribe(res => {
      this.data = res["msg"];
    });
  }

  logout() {
    this.authService.logout();
  }

  clearToken() {
    // ONLY FOR TESTING!
    this.storage.remove("access_token");

    let toast = this.toastController.create({
      message: "JWT removed",
      duration: 3000
    });
    toast.then(toast => toast.present());
  }

  getData() {
    this.dataService.getUsers().subscribe(data => {
      this.data = data;
    });
  }
  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }
}
