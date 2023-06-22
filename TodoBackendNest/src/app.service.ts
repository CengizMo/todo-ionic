import { Injectable } from '@nestjs/common';
import { Todo } from './todo.dto';
import { UsersService } from './users/users.service';

@Injectable()
export class AppService {

  constructor(private usersService: UsersService) {}

  private todos: Todo[] = [];


}
