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

  updateTodoName(id: string) {
    const task = 'New Name';
    this.todoService.updateTodoName(id, task).subscribe(() => {
      console.log('Todo-name is updated');
    });
  }

  updateTodoChecked(id: string, checked: boolean) {
    this.todoService.updateTodoChecked(id, checked).subscribe(() => {
      console.log('Todo-status is updated');
    });
  }

  deleteTodo(id: string) {
    this.todoService.deleteTodo(id).subscribe(() => {
      console.log('Todo was deleted');
    });
  }
}
