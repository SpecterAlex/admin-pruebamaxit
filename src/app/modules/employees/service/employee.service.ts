import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { IEmployee } from 'src/app/core/interfaces/models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  createEmployee(body: IEmployee): Observable<any> {
    const path = this.getPath('employees')
    return this.httpClient.post(path, body).pipe(share());
  }

  updateEmployee(body: IEmployee): Observable<any> {
    const path = this.getPath('employees')
    return this.httpClient.put(path, body).pipe(share());
  }

  getEmployee(userId: string): Observable<any> {
    const path = `${this.getPath('employees')}/${userId}`;
    return this.httpClient.get(path);
  }

  deleteEmployee(userId: string): Observable<any> {
    const path = `${this.getPath('employees')}/${userId}`;
    return this.httpClient.delete(path).pipe(share());
  }

  getEmployees(params?): Observable<any> {
    if (params) {
      Object.keys(params).forEach(
          (key) => params[key] === undefined && delete params[key]
      );
    }
    const path = this.getPath('employees')
    return this.httpClient.get(path,{ params }).pipe(share());
  }

  getCountries(): Observable<any> {
    const path = this.getPath('Countries')
    return this.httpClient.get(path).pipe(share());
  }

  getPath(path: string): string {
    return `${environment.basePath}${path}`;
  }
}
