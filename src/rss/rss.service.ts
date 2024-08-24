import { Injectable } from '@nestjs/common';
import * as Parser from 'rss-parser';
import { FeedItem } from './dto';

type CustomItem = {
  websiteUrl: string;
  duration: number;
};

@Injectable()
export class RssService {
  async load(url: string): Promise<FeedItem[]> {
    const parser: Parser<{}, CustomItem> = new Parser({
      customFields: {
        item: ['websiteUrl', 'duration'],
      },
    });

    const feed = await parser.parseURL('https://mediathekviewweb.de/feed');

    return feed.items.map((item) => ({
      guid: item.guid,
      title: item.title,
      content: item.content,
      link: item.link,
      creator: item.creator,
      pubDate: item.pubDate,
      websiteUrl: item.websiteUrl,
      duration: item.duration,
    }));
  }
}
