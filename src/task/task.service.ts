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

@Injectable()
export class TaskService {
  constructor(
    private readonly sourcesService: SourcesService,
    private readonly mediaService: MediaService,
    private readonly rssService: RssService,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  getTasks(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  @Interval(1000 * 30)
  scheduleRefreshRssTask() {
    const task: Task = {
      id: null,
      status: TaskStatus.NEW,
      type: TaskType.REFRESH_RSS,
    };
    this.taskRepository.save(task);
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
          this.executeRefreshRssTask();
          break;
      }
      this.taskRepository.update(
        { id: task.id },
        { status: TaskStatus.COMPLETED },
      );
    }
  }

  private async executeRefreshRssTask() {
    const feedItems: FeedItem[] = await this.rssService.load(
      'https://mediathekviewweb.de/feed',
    );

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
    }));

    for (const media of mediaItems) {
      const known = (await this.mediaService.find(media.id)) !== null;
      if (!known) {
        this.mediaService.save(media);
        this.saveDownloadMediaTask(media.id);
      }
    }
  }

  private saveDownloadMediaTask(mediaId: string): void {
    const task: Task = {
      id: null,
      mediaId,
      status: TaskStatus.NEW,
      type: TaskType.DOWNLOAD_MEDIA,
    };
    this.taskRepository.save(task);
  }
}
