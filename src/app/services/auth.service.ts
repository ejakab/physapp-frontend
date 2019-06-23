import { Platform, AlertController } from "@ionic/angular";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Storage } from "@ionic/storage";
import { environment } from "../../environments/environment";
import { tap, catchError, map, switchMap } from "rxjs/operators";
import { BehaviorSubject, Observable } from "rxjs";
import { User } from "../models/user.model";
import { DataService } from "./data.service";

interface UserDataJSON {
  items: User[];
}
export interface UpdatedUser {
  updatedUser: User;
}
interface UserCredentials {
  email: string;
  password: string;
}
const TOKEN_KEY = "access_token";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  url = environment.url;
  userToken = null;
  private _user: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  authenticationState = new BehaviorSubject(false);
  constructor(
    private http: HttpClient,
    private helper: JwtHelperService,
    private storage: Storage,
    private dataService: DataService,
    private plt: Platform,
    private alertController: AlertController
  ) {
    this.plt.ready().then(() => {
      this.checkToken();
    });
  }
  /** Returns you a nice user observable */
  get user(): Observable<User> {
    return this._user.asObservable();
  }
  checkToken() {
    this.storage.get(TOKEN_KEY).then(token => {
      if (token) {
        let decoded = this.helper.decodeToken(token);
        let isExpired = this.helper.isTokenExpired(token);

        if (!isExpired) {
          this.userToken = decoded;
          this.authenticationState.next(true);
        } else {
          this.storage.remove(TOKEN_KEY);
        }
      }
    });
  }

  register(credentials: UserCredentials) {
    return this.http.post(`${this.url}/api/register`, credentials).pipe(
      catchError(e => {
        this.showAlert(e.error.msg);
        throw new Error(e);
      })
    );
  }

  login(credentials: UserCredentials) {
    return this.http.post(`${this.url}/api/login`, credentials).pipe(
      tap(res => {
        this.storage.set(TOKEN_KEY, res["token"]);
        this.storage.set("email", credentials.email);
        this.userToken = this.helper.decodeToken(res["token"]);
        this.authenticationState.next(true);
      }),
      switchMap(res => {
        return this.dataService.getUsers();
      }),
      map(users => {
        for (const user of users) {
          if (user.email === credentials.email) {
            this._user.next(user);
            console.log(this._user.value);
          }
        }
      }),
      catchError(e => {
        this.showAlert(e.error.msg);
        throw new Error(e);
      })
    );
  }

  logout() {
    this.storage.remove(TOKEN_KEY).then(() => {
      this.authenticationState.next(false);
      this._user.next(null);
    });
  }

  getSpecialData() {
    return this.http.get(`${this.url}/api/special`).pipe(
      catchError(e => {
        let status = e.status;
        if (status === 401) {
          this.showAlert("You are not authorized for this!");
          this.logout();
        }
        throw new Error(e);
      })
    );
  }

  isAuthenticated(): boolean {
    return this.authenticationState.value;
  }
  updateUser(userDoc: User) {
    console.log("New user");

    console.log(userDoc);
    const user: User = userDoc;
    console.log(this._user.value.completed);

    this._user.next(user);
    console.log(this._user.value.completed);
  }
  private showAlert(msg: string): void {
    let alert = this.alertController.create({
      message: msg,
      header: "Error",
      buttons: ["OK"]
    });
    alert.then(alert => alert.present());
  }
}
