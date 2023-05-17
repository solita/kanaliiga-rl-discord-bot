import { BALL_CHASING_API_KEY } from './config';
import log from './log';
import https from 'https';
import FormData from 'form-data';

export class DocumentProcessor {
  filePath: string;

  constructor() {
    this.filePath = './temp';
  }

  upload(file: Buffer, fileName: string): Promise<string> {
    const BC_UPLOAD_URL =
      'https://ballchasing.com/api/v2/upload?visibility=private';

    return new Promise((resolve, reject) => {
      const form = new FormData();
      form.append('name', 'file');
      form.append('Content-Type', 'binary/octet-stream');
      form.append('file', file, { filename: fileName });

      const options = {
        method: 'POST',
        headers: {
          Authorization: BALL_CHASING_API_KEY,
          'Content-Type': 'multipart/form-data; boundary=' + form.getBoundary()
        },
        timeout: 1000
      };

      const req = https.request(BC_UPLOAD_URL, options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data = data + chunk.toString();
        });

        res.on('end', () => {
          const body = JSON.parse(data);

          if (res.statusCode === 201) {
            resolve(body.location);
          } else {
            reject(`${body.error}  ${body.location || ''}`);
          }
        });
      });

      req.on('error', (err: { message: string }) => {
        reject(err.message);
      });

      form.pipe(req);
      req.end();
    });
  }

  async download(url: string): Promise<Buffer> {
    log.info(`Downloading file ${url}....`);
    return new Promise((resolve, reject) => {
      https.get(url, (res) => {
        if (res.statusCode !== 200) {
          reject(`Failed to download file from ${url}`);
          return;
        }

        const chunks = [];

        res.on('data', (chunk) => {
          chunks.push(chunk);
        });

        res.on('end', () => {
          const buffer = Buffer.concat(chunks);
          resolve(buffer);
        });

        res.on('error', (err) => {
          reject(err);
        });
      });
    });
  }
}
