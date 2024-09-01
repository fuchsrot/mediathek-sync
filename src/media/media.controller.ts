import { Controller, Get } from '@nestjs/common';
import { MediaDto } from './dto';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  async getMedia(): Promise<MediaDto[]> {
    const media = await this.mediaService.find();
    console.log(typeof media[0].source.id);
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
