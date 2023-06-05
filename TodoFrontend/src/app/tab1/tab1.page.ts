import { Component, OnInit, OnDestroy } from '@angular/core';
import { TodoService } from '../todo.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private todoService: TodoService) {}

  ngOnInit() {}

  public alertButtons = ['OK'];

  createTodo() {
    const task = 'New Task';
    this.todoService.addTodo(task).pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      console.log('Todo is created');
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
