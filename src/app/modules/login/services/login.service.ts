import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { share } from 'rxjs/operators';
import { ILogin, IModule } from 'src/app/core/interfaces/models';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  error: string;
  public $logout = new Subject();

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private storageService: StorageService
  ) {}

  public login(body): Observable<any> {
    const headers = {
      'no-auth': 'true',
      'no-catch-on-error': 'true',
    };
    const url = this.getPath('auth/signin');
    return this.httpClient
      .post(url, body, {
        headers,
      })
      .pipe(share());
  }

  public isLogin(): boolean {
    const token = this.getToken();
    if (token) {
      return true;
    } else {
      return false;
    }
  }
  getPath(path: string): string {
    return `${environment.basePath}${path}`;
  }

  public logout(): void {
    this.$logout.next(true);
    this.clearSession();
    this.router.navigate(['/sign-in']);
  }

  public clearSession(): void {
    this.storageService.clearStorage();
  }

  public setToken(login: ILogin): void {
    this.storageService.setItem<ILogin>('login', login);
  }

  public getToken(): ILogin {
    return this.storageService.getItem<ILogin>('login');
  }

  public closeSession(): Observable<any> {
    const headers = {
      'no-catch-on-error': 'true',
    };
    const url = this.getPath('auth/logout');
    return this.httpClient.get(url, {
      headers,
    });
  }

  // error support
  public getError(): string {
    return this.error;
  }

  public setError(error: string): void {
    this.error = error;
  }

  public clearError(): void {
    this.error = undefined;
  }
  public httpErrorResponseHandler(response: any): boolean {
    if (response.status === 404) {
      this.setError('Error inesperado, intente más tarde.');
      return false;
    } else if (
      response.status === 400 &&
      response.error.message === 'Unauthorized'
    ) {
      this.setError('Verifica tus credenciales.');
    } else {
      this.setError(response.error.message);
    }
    return false;
  }
  getPermissionsForEmployees(): IModule[] {
    return [
      {
        id: 'employees',
        showInMenu: true,
        isActive: true,
        title: 'Empleados',
        routerLink: 'employees'
      },
    ];
  }
}
