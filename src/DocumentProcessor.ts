import { BALL_CHASING_API_KEY } from './config';
import log from './log';
import https from 'https';
//import FormData from 'form-data';

export class DocumentProcessor {
    filePath: string;

    constructor() {
        this.filePath = './temp';
    }

    async upload(
        file: Buffer,
        fileName: string,
        groupId: string
    ): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const BC_UPLOAD_URL = `https://ballchasing.com/api/v2/upload?group=${groupId}`;
            const formData = new FormData();
            const blob = new Blob([file]);
            formData.append('file', blob, fileName);

            try {
                const res = await fetch(BC_UPLOAD_URL, {
                    method: 'POST',
                    headers: {
                        Authorization: BALL_CHASING_API_KEY,
                        Accept: '*/*'
                    },
                    body: formData
                });

                const data = await res.json();

                if (res.status === 201) {
                    resolve(data.location);
                } else {
                    reject(`${data.error} ${data.location || ''}`);
                }
            } catch (error) {
                error.error ? resolve(error.error) : resolve(error);
            }
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
