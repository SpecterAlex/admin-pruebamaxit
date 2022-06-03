import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoInfoComponent } from './no-info.component';



@NgModule({
  declarations: [
    NoInfoComponent
  ],
  imports: [
    CommonModule,
  ],
  exports:[
    NoInfoComponent
  ]
})
export class NoInfoModule { }
