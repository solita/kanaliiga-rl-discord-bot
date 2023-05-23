import { BALL_CHASING_API_KEY } from './config';
import log from './log';

export class DocumentProcessor {
    async upload(
        file: Buffer,
        fileName: string,
        groupId: string
    ): Promise<string> {
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
                return data.location;
            } else {
                throw new Error(`${data.error} ${data.location || ''}`);
            }
        } catch (error) {
            throw new Error(error.message.trim());
        }
    }

    async download(url: string): Promise<Buffer> {
        log.info(`Attempting to download ${url}`);

        try {
            const res = await fetch(url);

            if (res.status !== 200) {
                throw res;
            }

            const file = await res.arrayBuffer();
            return Buffer.from(file);
        } catch (error) {
            if (error.status) throw error;
            throw new Error(error.message);
        }
    }
}
