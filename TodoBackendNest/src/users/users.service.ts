import { Injectable } from '@nestjs/common';
import { Todo } from 'src/todo/todo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
// This should be a real class/interface representing a user entity
// export type TempUser = any;

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

  ){}

  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }

  async getTodos(username: string): Promise<Todo[]> {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['todos'],
    });
    return user?.todos || [];
  }

  async addTodo(todo: Todo, username: string) {
    const user = await this.userRepository.findOne({ where: { username } });
    if (user) {
      user.todos.push(todo);
      await this.userRepository.save(user);
    }
  }

  async editTodo(id: number, task: string, username: string) {
    const user = await this.userRepository.findOne({ where: { username } });
    if (user && user.todos[id]) {
      user.todos[id].task = task;
      await this.userRepository.save(user);
      return user.todos[id].task;
    }
    return null;
  }

  async checkTodo(id: number, checked: boolean, username: string) {
    const user = await this.userRepository.findOne({ where: { username } });
    if (user && user.todos[id]) {
      if (user.todos[id].checked === checked) {
        return false;
      }
      user.todos[id].checked = checked;
      await this.userRepository.save(user);
      const tempTodo = user.todos[id];
      user.todos.splice(id, 1);
      if (checked) {
        user.todos.push(tempTodo);
        return `The task "${user.todos[user.todos.length - 1].task}" was checked`;
      } else {
        user.todos.unshift(tempTodo);
        return `The task "${user.todos[0].task}" was unchecked`;
      }
    }
    return null;
  }

  async deleteTodo(id: number, username: string) {
    const user = await this.userRepository.findOne({ where: { username } });
    if (user && user.todos[id]) {
      const deletedTask = user.todos[id].task;
      user.todos.splice(id, 1);
      await this.userRepository.save(user);
      return `The task "${deletedTask}" has been deleted.`;
    }
    return null;
  }
}

