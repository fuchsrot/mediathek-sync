import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Source } from './source.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSourceDto, SourceDto } from './dto';

@Injectable()
export class SourcesService {
  constructor(
    @InjectRepository(Source)
    private sourceRepository: Repository<Source>,
  ) {}

  create(dto: CreateSourceDto): Promise<Source> {
    const source = new Source();
    source.url = dto.url;
    source.title = dto.title;
    return this.sourceRepository.save(source);
  }

  findById(id: string): Promise<Source> {
    return this.sourceRepository.findOneBy({ id });
  }

  find(): Promise<SourceDto[]> {
    return this.sourceRepository.find();
  }
}
