import { Component, OnDestroy } from '@angular/core';
import { TodoService } from '../todo.service';
import { Subject, takeUntil } from 'rxjs';
import { Todo } from '../todo';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnDestroy {
  todos: Todo[] = [];
  editMode: boolean[] = [];
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private todoService: TodoService) {}

  ngOnInit() {
    this.todoService.getTodos().pipe(takeUntil(this.unsubscribe$)).subscribe((todos) => {
      this.todos = todos;
      this.editMode = Array(todos.length).fill(false);
    });
  }

  get todos$() {
    return this.todoService.getTodos$();
  }

  changeEditMode(index: number) {
    this.editMode[index] = true;
  }

  confirmTodoName(index: number) {
    const task = this.todos[index].task;
    this.todoService.updateTodoName(index, task).pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      console.log('Todo-Name wurde aktualisiert');
      this.editMode[index] = false;
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
