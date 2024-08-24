import { Controller, Get } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.entity';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  async getTasks(): Promise<Task[]> {
    return this.taskService.getTasks();
  }
}
