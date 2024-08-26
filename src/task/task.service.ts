import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { SourcesService } from '../sources/sources.service';
import { MediaService } from '../media/media.service';
import { RssService } from '../rss/rss.service';
import { FeedItem } from '../rss/dto';
import { Media } from '../media/media.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Task, Status as TaskStatus, Type as TaskType } from './task.entity';
import { Repository } from 'typeorm';
import { TargetDto, TaskDto } from './dto';
import { Source } from '../sources/source.entity';

@Injectable()
export class TaskService {
  constructor(
    private readonly sourcesService: SourcesService,
    private readonly mediaService: MediaService,
    private readonly rssService: RssService,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async getTasks(): Promise<TaskDto[]> {
    const dtos: TaskDto[] = [];
    const tasks = await this.taskRepository.find();
    for (const task of tasks) {
      const targetDto: TargetDto = {
        id: '',
        title: '',
      };
      if (task.type === TaskType.DOWNLOAD_MEDIA) {
        const media = await this.mediaService.findById(task.targetId);
        targetDto.id = media.id;
        targetDto.title = media.title;
      } else {
        //const source = await this.sourcesService.find(task.id)
        //targetDto.id = source.id;
        //targetDto.title = source.title;
        targetDto.id = '1';
        targetDto.title = 'todo';
      }
      const dto: TaskDto = {
        id: task.id,
        createDate: task.createDate,
        updateDate: task.updateDate,
        status: task.status,
        type: task.type,
        target: targetDto,
      };
      dtos.push(dto);
    }
    return dtos;
  }

  @Interval(1000 * 30)
  async scheduleRefreshRssTask() {
    const sources = await this.sourcesService.find();
    for (const source of sources) {
      const task = new Task(TaskType.REFRESH_RSS);
      task.targetId = source.id;
      this.taskRepository.save(task);
    }
  }

  //@Interval(1000 * 60)
  scheduleCleanTask() {
    this.taskRepository.delete({ status: TaskStatus.COMPLETED });
  }

  @Interval(1000 * 10)
  async taskExecutor() {
    const tasks: Task[] = await this.taskRepository.findBy({
      status: TaskStatus.NEW,
    });
    for (const task of tasks) {
      switch (task.type) {
        case TaskType.DOWNLOAD_MEDIA:
          break;
        case TaskType.REFRESH_RSS:
          this.executeRefreshRssTask(task);
          break;
      }
      this.taskRepository.update(
        { id: task.id },
        { status: TaskStatus.COMPLETED },
      );
    }
  }

  private async executeRefreshRssTask(task: Task) {
    const source = await this.sourcesService.findById(task.targetId);
    const feedItems: FeedItem[] = await this.rssService.load(source.url);

    const mediaItems: Media[] = feedItems.map((item) => ({
      id: item.guid,
      title: item.title,
      content: item.content,
      link: item.link,
      creator: item.creator,
      pubDate: item.pubDate,
      websiteUrl: item.websiteUrl,
      duration: item.duration,
      status: 'NEW',
      source: source,
    }));

    for (const media of mediaItems) {
      const known = (await this.mediaService.findById(media.id)) !== null;
      if (!known) {
        this.mediaService.save(media);
        this.saveDownloadMediaTask(media.id);
      }
    }
  }

  private saveDownloadMediaTask(mediaId: string): void {
    const task = new Task(TaskType.DOWNLOAD_MEDIA);
    task.targetId = mediaId;
    this.taskRepository.save(task);
  }
}
