import { AuthService } from '../../../services/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  data:any;
  userSub: Subscription;
  user: User;
  constructor(private authService: AuthService, private storage: Storage, private toastController: ToastController) { }

  ngOnInit() {
    this.userSub= this.authService.user.subscribe((user:User) =>{
      if (user) {
        this.user = user;
      }
    })
  }

  
  logout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }
}
