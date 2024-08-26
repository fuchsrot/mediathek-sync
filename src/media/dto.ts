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
  status: string;
  source: SourceDto;
  createDate: Date;
  updateDate: Date;
}
