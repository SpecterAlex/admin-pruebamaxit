import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeCreateAndUpdateComponent } from './employee-create-and-update.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: EmployeeCreateAndUpdateComponent }
];

@NgModule({
  declarations: [
    EmployeeCreateAndUpdateComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class EmployeeCreateAndUpdateModule { }
