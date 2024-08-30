import { Injectable, Logger } from '@nestjs/common';
import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';
import { IncomingMessage } from 'http';

@Injectable()
export class DownloadService {
  private readonly logger = new Logger(DownloadService.name);

  //TODO per env
  private downloadFolder = 'downloads';

  private normalizeFileName(file: string): string {
    return file
      .replaceAll(' ', '_')
      .replaceAll('ä', 'ae')
      .replaceAll('ö', 'oe')
      .replaceAll('/', '_')
      .replaceAll(':', '_')
      .replaceAll('ü', 'ue');
  }

  private extractFileEnding(url: string): string {
    const paths = url.split('.');
    return paths[paths.length - 1];
  }

  public download(url: string, title: string): Promise<string> {
    const file =
      this.normalizeFileName(title) + '.' + this.extractFileEnding(url);
    this.logger.log(
      `start download - file: ${file}, title: ${title}, url: ${url}`,
    );
    return new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(
        this.downloadFolder + path.sep + file,
      );
      https.get(url, (response: IncomingMessage) => {
        response.pipe(writeStream);
        writeStream
          .on('finish', () => {
            this.logger.log(`finish download - file: ${file}`);
            writeStream.close();
            resolve(file);
          })
          .on('error', () => {
            this.logger.error(`error download - file: ${file}`);
            fs.unlink(file, (error) => {
              this.logger.error(`error delete download - file: ${file}`);
            });
            reject();
          });
      });
    });
  }
}
