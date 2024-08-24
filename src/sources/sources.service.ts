import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Source } from './source.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSourceDto } from './dto';

@Injectable()
export class SourcesService {
  constructor(
    @InjectRepository(Source)
    private sourceRepository: Repository<Source>,
  ) {}

  create(dto: CreateSourceDto): Promise<Source> {
    const source: Source = {
      id: null,
      url: dto.url,
    };
    return this.sourceRepository.save(source);
  }

  getSources(): string {
    return 'Hello World!';
  }
}
