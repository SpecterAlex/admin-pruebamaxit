import { Injectable } from '@angular/core';
import {
  CanLoad,
  Route,
  UrlSegment,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
  CanActivate,
} from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../../modules/login/services/login.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad, CanActivate {
  constructor(private router: Router, private loginService: LoginService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return this.validateAcces(route.routeConfig.path);
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.validateAcces(route.path);
  }

  private validateAcces(path: string): boolean {
    const navBarOptions = this.loginService.getPermissionsForEmployees();

    if (this.loginService.isLogin()) {
      if (navBarOptions.length > 0) {
        let navBarOption;
        for (const module of navBarOptions) {
          if (module.isActive) {
            if (module.routerLink === path) {
              navBarOption = module;
              break;
            }
          }
        }
        if (!navBarOption) {
          this.router.navigate(['/app/' + navBarOptions[0].routerLink]);
          return false;
        }
        return true;
      } else {
        this.loginService.clearSession();
        this.router.navigate(['/login']);
        return false;
      }
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
