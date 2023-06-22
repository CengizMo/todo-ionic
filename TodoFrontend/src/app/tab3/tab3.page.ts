import { Component, OnInit, OnDestroy } from '@angular/core';
import { TodoService } from '../todo.service';
import { Subject, takeUntil } from 'rxjs';
import { Todo } from '../todo';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit, OnDestroy {
  todos: Todo[] = [];
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private todoService: TodoService) {}

  ngOnInit() {
    this.todoService.validateAccessToken();
    this.todoService.getTodos().pipe(takeUntil(this.unsubscribe$)).subscribe((todos) => {
      this.todos = todos;
    });
  }

  async onLogoutClick(){
    await this.todoService.logout();
  }

  get todos$() {
    return this.todoService.getTodos$();
  }

  deleteTodoItem(index: number) {
    this.todoService.deleteTodo(index).pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
