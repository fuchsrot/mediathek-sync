import { Status } from './media.entity';

export interface SourceDto {
  id: string;
  title: string;
}

export interface MediaDto {
  id: string;
  title: string;
  content?: string;
  link: string;
  creator: string;
  pubDate: string;
  websiteUrl: string;
  duration: number;
  status: Status;
  source: SourceDto;
  createDate: Date;
  updateDate: Date;
}
