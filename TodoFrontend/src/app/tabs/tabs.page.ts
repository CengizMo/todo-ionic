import { Component } from '@angular/core';
import { TodoService } from '../todo.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(private todoService: TodoService) {}

  createTodo() {
    const task = 'New Todo-Task';
    this.todoService.addTodo(task).subscribe(() => {
      console.log('Todo is created');
    });
  }

  updateTodoName(id: number) {
    const task = 'New Name';
    this.todoService.updateTodoName(id, task).subscribe(() => {
      console.log('Todo-name is updated');
    });
  }

  updateTodoChecked(id: number, checked: boolean) {
    this.todoService.updateTodoChecked(id, checked).subscribe(() => {
      console.log('Todo-status is updated');
    });
  }

  deleteTodo(id: number) {
    this.todoService.deleteTodo(id).subscribe(() => {
      console.log('Todo was deleted');
    });
  }
}
