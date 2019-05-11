import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { IonicModule } from '@ionic/angular';

import { InsidePage } from './inside.page';
import { InsideRoutingModule } from './inside-routing.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
InsideRoutingModule  ],
  declarations: [InsidePage]
})
export class InsidePageModule {}
