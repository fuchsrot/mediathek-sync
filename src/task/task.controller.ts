import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto, TaskDto } from './dto';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @HttpCode(204)
  create(@Body() dto: CreateTaskDto): Promise<void> {
    return this.taskService.create(dto);
  }

  @Get()
  async getTasks(): Promise<TaskDto[]> {
    return this.taskService.getTasks();
  }
}
