import { Injectable } from '@nestjs/common';
import * as https from 'https';
import * as fs from 'fs';
import { IncomingMessage } from 'http';

@Injectable()
export class DownloadService {
  public download(url: string, file: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(file);
      https.get(url, (response: IncomingMessage) => {
        response.pipe(writeStream);
        writeStream
          .on('finish', () => {
            writeStream.close();
            resolve();
          })
          .on('error', () => {
            console.log('Download Error');
            fs.unlink(file, () => {
              console.log('File deletion error');
            });
            reject();
          });
      });
    });
  }
}
