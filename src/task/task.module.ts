import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { SourcesModule } from '../sources/sources.module';
import { MediaModule } from '../media/media.module';
import { RssModule } from '../rss/rss.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';

@Module({
  imports: [
    SourcesModule,
    MediaModule,
    RssModule,
    TypeOrmModule.forFeature([Task]),
  ],
  providers: [TaskService],
  controllers: [TaskController],
})
export class TaskModule {}
