import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Todo } from './todo';
import { switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private baseUrl = 'http://localhost:3000';
  private todos$: BehaviorSubject<Todo[]> = new BehaviorSubject<Todo[]>([]);

  constructor(private http: HttpClient) {
    this.loadTodos();
  }

  private getHeaders(): HttpHeaders {
    // Get the access token from local storage after successful login
    const accessToken = localStorage.getItem('accessToken');
    return new HttpHeaders({
      Authorization: `Bearer ${accessToken}`
    });
  }

  
  login(username: string, password: string): Observable<any> {
    const url = `${this.baseUrl}/auth/login`;
    return this.http.post(url, { username: username, password: password });
  }


  private loadTodos() {
    const url = `${this.baseUrl}/todos`;
    const headers = this.getHeaders();

    this.http.get<Todo[]>(url, { headers }).subscribe(todos => {
      this.todos$.next(todos);
    });
  }

  getTodos$(){
    return this.todos$;
  }

  getTodos(): Observable<Todo[]> {
    return this.todos$.asObservable();
  }

  addTodo(task: string): Observable<any> {
    const url = `${this.baseUrl}/todos`;
    const headers = this.getHeaders();

    return this.http.post(url, { task }, { headers }).pipe(
      switchMap((response: any) => {
        return this.getUpdatedTodos();
      })
    );
  }

  updateTodoName(id: number, task: string): Observable<any> {
    const url = `${this.baseUrl}/todos/todo/${id}`;
    const headers = this.getHeaders();
    return this.http.put(url, { task }, { headers });
  }

  updateTodoChecked(id: number, checked: boolean): Observable<any> {
    const url = `${this.baseUrl}/todos/todo/check/${id}`;
    const headers = this.getHeaders();
    return this.http.put(url, { checked }, { headers });
  }

  deleteTodo(index: number): Observable<any> {
    const url = `${this.baseUrl}/todos/todo/${index}`;
    const headers = this.getHeaders();

    return this.http.delete(url, { headers }).pipe(
      switchMap(() => {
        return this.getUpdatedTodos();
      })
    );
  }

  private getUpdatedTodos(): Observable<Todo[]> {
    const url = `${this.baseUrl}/todos`;
    const headers = this.getHeaders();

    return this.http.get<Todo[]>(url, { headers }).pipe(
      tap(todos => {
        this.todos$.next(todos);
      })
    );
  }
}
