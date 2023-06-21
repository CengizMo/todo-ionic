import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Todo } from './todo';
import { switchMap, tap } from 'rxjs/operators';
import { StorageService } from './storage.service';
import { environment } from 'src/environments/environment';
import { Capacitor } from '@capacitor/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private baseUrl = Capacitor.getPlatform() === 'web' ? `${environment.auth.web.redirectUrl}` : `${environment.auth.emulator.redirectUrl}`;
  private todos$: BehaviorSubject<Todo[]> = new BehaviorSubject<Todo[]>([]);

  constructor(
    private http: HttpClient, 
    private storageService: StorageService, 
    private router: Router,
  ) 
  {}

  async logout(){
    await this.storageService.clearAccessToken();
    this.router.navigate(['/login']);
  }

  async validateAccessToken(){
    const accessToken = await this.storageService.get('accessToken');
      if(!accessToken){
        this.router.navigate(['/login']);
      }
      
  }

  getBaseUrl(){
    switch (Capacitor.getPlatform()) {
      case 'web':
        return `${environment.auth.web.redirectUrl}`;
      
      case 'android':
        return `${environment.auth.android.redirectUrl}`;
    
      default:
        return '';
        break;
    }
  }

  async getToken()
  {
    return await this.storageService.get('accessToken');
  }

  
  login(username: string, password: string): Observable<any> {
    const url = `${this.baseUrl}/auth/login`;
    return this.http.post(url, { username: username, password: password });
  }

  getTodos$(){
    return this.todos$;
  }

  getTodos(): Observable<Todo[]> {
    const url = `${this.baseUrl}/todos`;
    this.http.get<Todo[]>(url).subscribe(todos => {
      this.todos$.next(todos);
    });

    return this.todos$.asObservable();
  }

  addTodo(task: string): Observable<any> {
    const url = `${this.baseUrl}/todos`;

    return this.http.post(url, { task }).pipe(
      switchMap((response: any) => {
        return this.getUpdatedTodos();
      })
    );
  }

  updateTodoName(id: number, task: string): Observable<any> {
    const url = `${this.baseUrl}/todos/todo/${id}`;
    return this.http.put(url, { task });
  }

  updateTodoChecked(id: number, checked: boolean): Observable<any> {
    const url = `${this.baseUrl}/todos/todo/check/${id}`;
    return this.http.put(url, { checked });
  }

  deleteTodo(index: number): Observable<any> {
    const url = `${this.baseUrl}/todos/todo/${index}`;

    return this.http.delete(url).pipe(
      switchMap(() => {
        return this.getUpdatedTodos();
      })
    );
  }

  private getUpdatedTodos(): Observable<Todo[]> {
    const url = `${this.baseUrl}/todos`;

    return this.http.get<Todo[]>(url).pipe(
      tap(todos => {
        this.todos$.next(todos);
      })
    );
  }
}
