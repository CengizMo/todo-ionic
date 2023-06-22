import { Body, Controller, Delete, Get, Param, Post, Put, Request, Res} from '@nestjs/common';
import { Response } from 'express';
import { Todo } from 'src/todo.dto';
import { UsersService } from 'src/users/users.service';


@Controller('todos')
export class TodoController {

    constructor(private usersService: UsersService) { }

    @Get()
    async getTodos(@Request() req) {
        return await this.usersService.getTodos(req.user.username);
    } 

    @Get('todo/:id')
    async getTodo(@Param() params: any, @Request() req) {
        const tempTodos = await this.usersService.getTodos(req.user.username);
        return tempTodos[params.id];
    }

    @Post()
    async addTodo(@Res() res: Response, @Body() todo: Todo, @Request() req) {

        if(todo.task.length === 0 || todo.task === undefined)
        {
            todo.task = 'New task';
        }
        if (todo.checked !== false) {
            todo.checked = false;
        }
        this.usersService.addTodo(todo, req.user.username);
        const tempTodos = await this.usersService.getTodos(req.user.username);
        res.json({message: `New task created: "${tempTodos[0].task}"`});
    }

    @Put('todo/:id')
    async editTodo(@Res() res: Response, @Body() todo: Todo, @Param() params: any, @Request() req) {
        const task = this.usersService.editTodo(params.id, todo.task, req.user.username);
        res.status(200).json({message: `The old task was updated to ${task}`});
    }

    @Put('todo/check/:id')
    async checkTodo(@Res() res: Response, @Body() todo: Todo, @Param() params: any, @Request() req) {
        const response = this.usersService.checkTodo(params.id, todo.checked, req.user.username);
        if (response === false) {
            const tempTask = await this.usersService.getTodos(req.user.username);
            res.status(409).json({message:
                todo.checked === false ?
                    `you tried to uncheck the task "${tempTask[params.id].task}" which is already unchecked` :
                    `you tried to check the task "${tempTask[params.id].task}" which is already checked`
        }).end();
        }
        return response;

    }

    @Delete('todo/:id')
    async deleteTodo(@Res() res: Response, @Param() params: any, @Request() req) {
        const response = this.usersService.deleteTodo(params.id, req.user.username);
        res.status(200).json({message: response}) ;
    }
}
