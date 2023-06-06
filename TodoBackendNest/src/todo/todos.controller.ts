import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from 'src/app.service';
import { Todo } from 'src/todo.dto';

@Controller('todos')
export class TodoController {

    constructor(private appService: AppService) { }

    @Get()
    getTodos() {
        return this.appService.getTodos();
    }

    @Get('todo/:id')
    getTodo(@Param() params: any) {
        const tempTodos = this.appService.getTodos();
        return tempTodos[params.id];
    }

    @Post()
    async addTodo(@Body() todo: Todo) {

        if(todo.task.length === 0 || todo.task === undefined)
        {
            todo.task = 'New task';
        }
        if (todo.checked !== false) {
            todo.checked = false;
        }
        this.appService.addTodo(todo);
        const tempTodos = this.appService.getTodos();
        return `New task created: "${tempTodos[0].task}"`;
    }

    @Put('todo/:id')
    async editTodo(@Body() todo: Todo, @Param() params: any) {
        const task = this.appService.editTodo(params.id, todo.task);
        return `The old task was updated to "${task}"`;
    }

    @Put('todo/check/:id')
    async checkTodo(@Body() todo: Todo, @Param() params: any, res: Response) {
        const response = this.appService.checkTodo(params.id, todo.checked);
        if (response === false) {
            const tempTask = this.appService.getTodos();
            res.status(409).send(
                todo.checked === false ?
                    `you tried to uncheck the task "${tempTask[params.id].task}" which is already unchecked` :
                    `you tried to check the task "${tempTask[params.id].task}" which is already checked`
            ).end();
        }
        return response;

    }

    @Delete('todo/:id')
    async deleteTodo(@Param() params: any) {
        const response = this.appService.deleteTodo(params.id);
        return response;
    }
}
