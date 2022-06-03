import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormView } from 'src/app/core/classes/form-view';
import { Utilities } from 'src/app/core/classes/utilities';
import { ILogin, IResponse } from 'src/app/core/interfaces/models';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  get email(): AbstractControl {
    return this.loginForm.get('email');
  }
  get password(): AbstractControl {
    return this.loginForm.get('password');
  }

  showPassword = false;
  private subscriptions = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public loginService: LoginService
  ) {}

  ngOnInit(): void {
    if (this.loginService.isLogin()) {
      this.router.navigate(['/app']);
    }

    this.loginForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,64}/
          ),
        ],
      ],
      password: ['', [Validators.required]],
    });
  }

  onLoginFormClick(): any {
    if (!this.loginForm.valid) {
      Utilities.touchAllControls(this.loginForm);
      return false;
    }
    this.loginService.login(this.loginForm.value).subscribe(
      (loginResponse: IResponse<ILogin>) => {
        this.loginService.setToken(loginResponse.data);
        this.router.navigate(['/app']);
        return true;
      },
      (error: any) => {
        this.loginService.httpErrorResponseHandler(error);
      }
    );
  }
}
