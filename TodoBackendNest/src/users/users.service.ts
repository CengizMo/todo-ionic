import { Injectable } from '@nestjs/common';
import { Todo } from 'src/todo.dto';
// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {

  private johnTodos: Todo[] = [
    {task: "Putzen", checked: false}, 
    {task: "Schwimmen", checked: false}, 
    {task: "Müll rausbringen", checked: false}
    ];
  
    
  private mariaTodos: Todo[] = [
    {task: "Wäsche aufhängen", checked: false}, 
    {task: "Tanzen", checked: false}, 
    {task: "Kochen", checked: false}
    ];


  private users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
      todos: this.johnTodos
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
      todos: this.mariaTodos
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }

  async getTodos(username: string): Promise<Todo[]> {
    const user = await this.findOne(username);
    return user.todos;
  }

  addTodo(todo: Todo, username: string){
    const userIndex = this.users.findIndex(user => user.username === username);
    this.users[userIndex].todos.unshift(todo);
  }

  editTodo(id: number, task: string, username: string) {
    const userIndex = this.users.findIndex(user => user.username === username);
    this.users[userIndex].todos[id].task = task;
    return this.users[userIndex].todos[id].task;
  }

  checkTodo(id: number, checked: boolean, username: string){
    const userIndex = this.users.findIndex(user => user.username === username);

    if(this.users[userIndex].todos[id].checked === checked)
    {
      return false;
    }

    this.users[userIndex].todos[id].checked = checked;
    const tempTodo = this.users[userIndex];
    this.users.splice(id, 1);

    if(checked)
    {
        this.users.push(tempTodo);
        return `The task "${this.users[userIndex].todos[this.users.length - 1].task}" was checked`
    }
    else
    {
        this.users.unshift(tempTodo);
        return `The task "${this.users[userIndex].todos[0].task}" was unchecked`
    }
  }

  deleteTodo(id: number, username: string){
    const userIndex = this.users.findIndex(user => user.username === username);
    const tempTodo = this.users[userIndex].todos[id].task;
    this.users[userIndex].todos.splice(id, 1)
    return `The Task ${tempTodo} is deleted`;
  }
}

