import { Controller, Get, Post, Body, HttpCode } from '@nestjs/common';
import { SourcesService } from './sources.service';
import { CreateSourceDto } from './dto';

@Controller('sources')
export class SourcesController {
  constructor(private readonly sourcesService: SourcesService) {}

  @Post()
  @HttpCode(204)
  create(@Body() dto: CreateSourceDto) {
    this.sourcesService.create(dto);
  }

  @Get()
  getHello(): string {
    return 'sources';
    //return this.sourcesService.getHello();
  }
}
