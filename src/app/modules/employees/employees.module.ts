import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeesComponent } from './employees.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: EmployeesComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'fulll' },
      { path: 'list', loadChildren: () => import('./employee-list/employee-list.module').then(m => m.EmployeeListModule) },
      { path: 'create', loadChildren: () => import('./employee-create-and-update/employee-create-and-update.module').then(m => m.EmployeeCreateAndUpdateModule) },
      { path: 'update/:id', loadChildren: () => import('./employee-create-and-update/employee-create-and-update.module').then(m => m.EmployeeCreateAndUpdateModule) }
    ]
  }
];

@NgModule({
  declarations: [
    EmployeesComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ]
})
export class EmployeesModule { }
