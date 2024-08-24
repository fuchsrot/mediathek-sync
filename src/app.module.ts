import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SourcesModule } from './sources/sources.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Source } from './sources/source.entity';
import { RssModule } from './rss/rss.module';
import { MediaModule } from './media/media.module';
import { Media } from './media/media.entity';
import { TaskModule } from './task/task.module';
import { Task } from './task/task.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      password: 'mediatheksync',
      username: 'mediatheksync',
      entities: [Source, Media, Task],
      database: 'mediatheksync',
      synchronize: true,
      logging: true,
    }),
    RssModule,
    SourcesModule,
    MediaModule,
    TaskModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
