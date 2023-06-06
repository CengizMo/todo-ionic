import { Injectable } from '@nestjs/common';
import { Todo } from './todo.dto';

@Injectable()
export class AppService {

  private todos: Todo[] = [
    {task: "Putzen", checked: false}, 
    {task: "Schwimmen", checked: false}, 
    {task: "Müll rausbringen", checked: false}
    ];

  getTodos(): Todo[] {
    return this.todos;
  }

  addTodo(todo: Todo){
    this.todos.unshift(todo);
  }

  editTodo(id: number, task: string) {
    this.todos[id].task = task;
    return this.todos[id].task;
  }

  checkTodo(id: number, checked: boolean){

    if(this.todos[id].checked === checked)
    {
      return false;
    }

    this.todos[id].checked = checked;
    const tempTodo = this.todos[id];
    this.todos.splice(id, 1);

    if(checked)
    {
        this.todos.push(tempTodo);
        return `The task "${this.todos[this.todos.length - 1].task}" was checked`
    }
    else
    {
        this.todos.unshift(tempTodo);
        return `The task "${this.todos[0].task}" was unchecked`
    }
  }

  deleteTodo(id: number){
    const tempTodo = this.todos[id].task;
    this.todos.splice(id, 1)
    return `The Task ${tempTodo} is deleted`;
  }
}
