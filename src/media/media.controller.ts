import { Controller, Get } from '@nestjs/common';
import { MediaDto } from './dto';
import { MediaService } from './media.service';
import { title } from 'process';
import { publicDecrypt } from 'crypto';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  async getMedia(): Promise<MediaDto[]> {
    const media = await this.mediaService.find();
    return media.map((media) => ({
      id: media.id,
      title: media.title,
      content: media.content,
      link: media.link,
      creator: media.creator,
      pubDate: media.pubDate,
      websiteUrl: media.websiteUrl,
      duration: media.duration,
      status: media.status,
      createDate: media.createDate,
      updateDate: media.updateDate,
      source: {
        id: media.source.id,
        title: media.source.title,
      },
    }));
  }
}
