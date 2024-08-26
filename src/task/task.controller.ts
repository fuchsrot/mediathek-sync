import { Controller, Get } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskDto } from './dto';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  async getTasks(): Promise<TaskDto[]> {
    return this.taskService.getTasks();
  }
}
