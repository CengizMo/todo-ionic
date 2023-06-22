import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TodoService } from '../todo.service';
import { Subject, takeUntil } from 'rxjs';
import { StorageService } from '../storage.service';

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
    private todoService: TodoService,
    private storageService: StorageService
  ) {
    setTimeout(async () => {
      await this.validateToken();
    })
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  async validateToken() {
    const accessToken = await this.storageService.get('accessToken');
    console.log(accessToken);
    if (accessToken !== undefined && accessToken !== null) {
      this.todoService.getTodos();
      this.router.navigate(['/home']);
    }

  }

  async login() {
    const { username, password } = this.loginForm.value;
    this.loginError = '';

    try {
      this.todoService.login(username, password).pipe(takeUntil(this.unsubscribe$)).subscribe((data) => {
        this.storageService.set('accessToken', data.access_token);

        this.router.navigate(['/home']);
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
