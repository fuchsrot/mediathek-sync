import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { SourcesService } from '../sources/sources.service';
import { MediaService } from '../media/media.service';
import { RssService } from '../rss/rss.service';
import { FeedItem } from '../rss/dto';
import { Media } from '../media/media.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Task, Status as TaskStatus, Type as TaskType } from './task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto, TargetDto, TaskDto } from './dto';
import { Source } from '../sources/source.entity';
import { DownloadService } from 'src/download/download.service';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    private readonly sourcesService: SourcesService,
    private readonly mediaService: MediaService,
    private readonly rssService: RssService,
    private readonly downloadService: DownloadService,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async create(dto: CreateTaskDto): Promise<TaskDto> {
    const task = new Task(dto.type);
    task.status = TaskStatus.SCHEDULED;
    task.targetId = dto.targetId;
    this.taskRepository.save(task);
    let taskDto: TaskDto;
    if (
      dto.type === TaskType.DOWNLOAD_MEDIA ||
      dto.type === TaskType.DELETE_FILE
    ) {
      if (dto.type === TaskType.DOWNLOAD_MEDIA) {
        await this.mediaService.updateStatus(dto.targetId, {
          status: 'SCHEDULED_DOWNLOAD',
        });
      } else {
        await this.mediaService.updateStatus(dto.targetId, {
          status: 'SCHEDULED_DELETE',
        });
      }
      const media = await this.mediaService.findById(task.targetId);
      taskDto = this.mapTask(task, media.title);
    } else {
      const source = await this.sourcesService.findById(task.targetId);
      taskDto = this.mapTask(task, source.title);
    }
    return taskDto;
  }

  async getTasks(): Promise<TaskDto[]> {
    const dtos: TaskDto[] = [];
    const tasks = await this.taskRepository.find();
    for (const task of tasks) {
      let dto: TaskDto;
      if (task.type === TaskType.DOWNLOAD_MEDIA) {
        const media = await this.mediaService.findById(task.targetId);
        dto = this.mapTask(task, media.title);
      } else {
        const source = await this.sourcesService.findById(task.targetId);
        dto = this.mapTask(task, source.title);
      }
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

  @Interval(1000 * 60 * 5) // 5 min
  scheduleCleanTask() {
    this.logger.log('start clean up task');
    this.taskRepository.delete({ status: TaskStatus.COMPLETED });
  }

  @Interval(1000 * 10)
  async taskExecutor() {
    this.logger.log('start task execution');
    const tasks: Task[] = await this.taskRepository.findBy({
      status: TaskStatus.SCHEDULED,
    });
    for (const task of tasks) {
      this.logger.log(
        `start task execution - type: ${task.type}, id: ${task.id}, targetId: ${task.targetId}, created: ${task.createDate}`,
      );
      switch (task.type) {
        case TaskType.DOWNLOAD_MEDIA:
          this.executeDownloadMediaTask(task);
          break;
        case TaskType.REFRESH_RSS:
          this.executeRefreshRssTask(task);
          break;
      }
      // TODO
      this.taskRepository.update(
        { id: task.id },
        { status: TaskStatus.COMPLETED },
      );
      this.logger.log(
        `stop task execution - type: ${task.type}, id: ${task.id}`,
      );
    }
  }

  private async deleteDownloadFileTask(task: Task) {
    //this.downloadService.
  }

  private async executeDownloadMediaTask(task: Task) {
    this.mediaService.updateStatus(task.targetId, { status: 'RUNNING' });
    const media = await this.mediaService.findById(task.targetId);
    const file = await this.downloadService.download(media.link, media.title);
    this.mediaService.updateStatus(task.targetId, {
      status: 'DOWNLOADED',
      file,
    });
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
        //this.saveDownloadMediaTask(media.id);
      }
    }
  }

  private saveDownloadMediaTask(mediaId: string): void {
    const task = new Task(TaskType.DOWNLOAD_MEDIA);
    task.targetId = mediaId;
    this.taskRepository.save(task);
  }

  private mapTask(task: Task, title: string): TaskDto {
    return {
      id: task.id,
      createDate: task.createDate,
      updateDate: task.updateDate,
      status: task.status,
      type: task.type,
      target: {
        id: task.id,
        title,
      },
    };
  }
}
