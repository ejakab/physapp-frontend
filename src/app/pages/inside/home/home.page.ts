import { AuthService } from "../../../services/auth.service";
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit
} from "@angular/core";
import { Subscription } from "rxjs";
import { User } from "src/app/models/user.model";
import { ChartOptions, ChartType, ChartColor } from "chart.js";
import { Label } from "ng2-charts";
import { DizzyLog } from "src/app/models/dizzyLog.model";
import { NgForm } from "@angular/forms";
import { LogService } from "src/app/services/log.service";
import { distinctUntilChanged } from "rxjs/operators";

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"]
})
export class HomePage implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("myChart") chart: ElementRef;
  @ViewChild("f") f: NgForm;
  canSubmit = false;
  isLoading = true;

  chartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [
        {
          type: "time",
          distribution: "linear",
          time: {
            minUnit: "day",
            max: new Date().toISOString(),
            unit: "day",
            round: "day"
          }
        }
      ],
      yAxes: [
        {
          ticks: {
            min: 0,
            max: 10,
            stepSize: 1
          }
        }
      ]
    }
  };
  chartLabels: Label[] = [];
  chartType: ChartType = "line";
  chartLegend = true;
  chartColors: ChartColor;
  chartData: any[] = [{ data: [], label: "Dizziness" }];
  userSub: Subscription;
  user: User;
  constructor(
    private authService: AuthService,
    private logService: LogService
  ) {}

  ngOnInit() {
    this.userSub = this.authService.user
      .pipe(distinctUntilChanged())
      .subscribe((user: User) => {
        if (user) {
          this.user = user;
          console.log("upd user graph");

          if (user.dizzyLog) {
            console.log(user.dizzyLog);

            const today = new Date().toDateString();
            const lastLog = new Date(
              user.dizzyLog[user.dizzyLog.length - 1].date
            ).toDateString();
            if (today === lastLog) {
              this.canSubmit = false;
            } else {
              this.canSubmit = true;
            }
            this.updateChart(user.dizzyLog);
          }
        }
        this.isLoading = false;
      });
  }
  ngAfterViewInit() {
    
  }
  updateChart(dizzyLog: DizzyLog[]) {
    this.chartData[0].data.length = 0;
    dizzyLog.forEach(log => {
      this.chartData[0].data.push({ t: log.date, y: log.level });
    });
  }

  onSubmit() {
    const log = new DizzyLog(this.f.value.level, new Date());
    this.logService.addDizzyLog(log);
    this.canSubmit = false;
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
