import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TodoService } from '../todo.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loginForm: FormGroup;
  loginError: string = "";
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private todoService: TodoService
  ) {
    if(localStorage.getItem('accessToken') && localStorage.getItem('accessToken') !== undefined)
    {
      this.router.navigate(['/tabs/create']);
    }
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  async login() {
    const { username, password } = this.loginForm.value;
    this.loginError = '';

    try {
      this.todoService.login(username, password).pipe(takeUntil(this.unsubscribe$)).subscribe((data) => {
        console.log(data);
        localStorage.setItem('accessToken', data.access_token);
        this.router.navigate(['/tabs/create']);
      },
      (error) => {
        this.loginError = 'Invalid username or password';
        console.error(error);
      }
      )
    } catch (error) {
      this.loginError = 'Invalid username or password';
      console.error(error);
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
