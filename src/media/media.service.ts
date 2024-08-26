import { Injectable } from '@nestjs/common';
import { Media } from './media.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
  ) {}

  save(media: Media) {
    this.mediaRepository.save(media);
  }

  async findById(id: string): Promise<Media | null> {
    return await this.mediaRepository.findOneBy({ id });
  }

  async find(): Promise<Media[]> {
    return await this.mediaRepository.find();
  }
}
