import { Component, OnInit, OnDestroy } from '@angular/core';
import { TodoService } from '../todo.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  todos!: any[];
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private todoService: TodoService) {}

  ngOnInit() {
    this.loadTodos();
  }

  private loadTodos() {
    this.todoService.getTodos().pipe(takeUntil(this.unsubscribe$)).subscribe((todos) => {
      this.todos = todos;
    });
  }

  deleteTodoItem(index: number) {
    const id = index.toString();
    this.todoService.deleteTodo(id).pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.todos.splice(index, 1);
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
