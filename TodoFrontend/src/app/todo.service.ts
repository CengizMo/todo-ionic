import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getTodos(): Observable<any[]> {
    const url = `${this.baseUrl}/todos`;
    return this.http.get<any[]>(url);
  }

  addTodo(task: string): Observable<any> {
    const url = `${this.baseUrl}/todos`;
    return this.http.post(url, { task });
  }

  updateTodoName(id: string, task: string): Observable<any> {
    const url = `${this.baseUrl}/todos/todo/${id}`;
    return this.http.put(url, { task });
  }

  updateTodoChecked(id: string, checked: boolean): Observable<any> {
    const url = `${this.baseUrl}/todos/todo/check/${id}`;
    return this.http.put(url, { checked });
  }

  deleteTodo(id: string): Observable<any> {
    const url = `${this.baseUrl}/todos/todo/${id}`;
    return this.http.delete(url);
  }
}
