import { Body, Controller, Delete, Get, Param, Post, Put, Request, Res } from '@nestjs/common';
import { Response } from 'express';
import { Todo } from './todo.entity';
import { UsersService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('todos')
@Controller('todos')
export class TodoController {
  constructor(
    private usersService: UsersService,
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all todos', description: 'Returns all todos'})
  @ApiBearerAuth()
  @ApiHeader({ name: 'Authorization', description: 'Bearer token', required: true })
  @ApiResponse({ status: 200, description: 'Success', type: Todo, isArray: true })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  async getTodos(@Request() req) {
    return await this.usersService.getTodos(req.user.sub);
  }

  @Get('todo/:id')
  @ApiOperation({ summary: 'Get a single todo', description: 'Returns a single todo'})
  @ApiBearerAuth()
  @ApiHeader({ name: 'Authorization', description: 'Bearer token', required: true })
  @ApiParam({ name: 'id', description: 'ID of the todo', required: true, type: Number })
  @ApiResponse({ status: 201, description: 'Success', type: Todo })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  async getTodoById(@Param('id') id: number) {
    console.log(id);
    const user = await this.todoRepository.findOne({where: { id }})
    console.log(user);
    return user;
  }

  @Post()
  @ApiOperation({ summary: 'Create a todo', description: 'Creating a single todo'})
  @ApiBearerAuth()
  @ApiHeader({ name: 'Authorization', description: 'Bearer token', required: true })
  @ApiBody({
    schema: {
      properties: {
        task: { type: 'string', example: 'Example Name', description: 'The task name', minLength: 1 },
        checked: { type: 'boolean', example: false, description: 'The task status (true/false)' },
      },
      required: ['task'],
      example: {
        task: 'Example Name',
        checked: false,
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Created',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: `New task created: 'tst'` },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  async addTodo(
    @Res() res: Response,
    @Body() todo: Todo,
    @Request() req
  ) {
    const user = await this.usersService.findOne(req.user.sub);
    const existingTodos = await this.todoRepository.findAndCount({ where: { user } });
    const maxId = Math.max(...existingTodos[0].map((t) => t.id));
    if(maxId === -Infinity){
      todo.id = 0;
    }
    else
    {
      todo.id = maxId + 1;
    }
    todo.user = user;
    const createdTodo = await this.todoRepository.save(todo);
    const message = `New task created: '${createdTodo.task}'`;
    res.json({ message });
  }

  @Put('todo/:id')
  @ApiOperation({ summary: 'Edit a single todo', description: 'Editing a single todo'})
  @ApiBearerAuth()
  @ApiHeader({ name: 'Authorization', description: 'Bearer token', required: true })
  @ApiParam({ name: 'id', description: 'ID of the todo', required: true, type: Number })
  @ApiBody({
    schema: {
      properties: {
        task: { type: 'string', example: 'Example Name', description: 'The task name', minLength: 1 },
        checked: { type: 'boolean', example: false, description: 'The task status (true/false)' },
      },
      required: ['task'],
      example: {
        task: 'Example Name',
        checked: false,
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: `Task updated: 'tst'` },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  async editTodo(
    @Res() res: Response,
    @Param('id') id: number,
    @Body() todo: Todo
  ) {
    const updatedTodo = await this.todoRepository.findOne({where: {id}});
    if (!updatedTodo) {
      res.status(404).json({ message: 'Todo not found' });
    } else {
      updatedTodo.task = todo.task;
      const savedTodo = await this.todoRepository.save(updatedTodo);
      const message = `Task updated: '${savedTodo.task}'`;
      res.status(200).json({ message });
    }
  }

  @Put('todo/check/:id')
  @ApiOperation({ summary: 'Check or uncheck a todo', description: 'Checking or unchecking a todo'})
  @ApiBearerAuth()
  @ApiHeader({ name: 'Authorization', description: 'Bearer token', required: true })
  @ApiParam({ name: 'id', description: 'ID of the todo', required: true, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Success',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: `Task updated: 'tst'` },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  async checkTodo(
    @Res() res: Response,
    @Param('id') id: number,
    @Body() todo: Todo
  ) {
    const updatedTodo = await this.todoRepository.findOne({where: {id}});
    if (!updatedTodo) {
      res.status(404).json({ message: 'Todo not found' });
    } else {
      updatedTodo.checked = todo.checked;
      const savedTodo = await this.todoRepository.save(updatedTodo);
      const message = todo.checked ? 'checked' : 'unchecked';
      res.status(200).json({ message: `Task '${savedTodo.task}' ${message}` });
    }
  }

  @Delete('todo/:id')
  @ApiOperation({ summary: 'Delete a single todo', description: 'Deleting a single todo'})
  @ApiBearerAuth()
  @ApiHeader({ name: 'Authorization', description: 'Bearer token', required: true })
  @ApiParam({ name: 'id', description: 'ID of the todo', required: true, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Success',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: `Task 'tst' deleted` },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  async deleteTodo(
    @Res() res: Response,
    @Param('id') id: number
  ) {
    const deletedTodo = await this.todoRepository.findOne({where: {id}});
    if (!deletedTodo) {
      res.status(404).json({ message: 'Todo not found' });
    } else {
      await this.todoRepository.delete(id);
      const remainingTodos = await this.todoRepository.find();
      for (let i = 0; i < remainingTodos.length; i++) {
        const todo = remainingTodos[i];
        console.log(todo);
        if (todo.id > id) {
          todo.id = todo.id - 1;
          await this.todoRepository.save(todo);
        }
      }
      const message = `Task '${deletedTodo.task}' deleted`
      res.status(200).json({ message });
    }
  }

  @Delete()
  async clearAllTodos(
    @Res() res:Response
  ){
    await this.todoRepository.clear();
    const message = 'All todos were deleted!'
    res.status(200).json({message});
  }
}