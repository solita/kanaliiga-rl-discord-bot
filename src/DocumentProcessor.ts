import { BALL_CHASING_API_KEY } from './config';

export class DocumentProcessor {
    async upload(
        file: Buffer,
        fileName: string,
        groupId: string
    ): Promise<string> {
        console.log(`Attempting to upload ${fileName}`);

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
                console.log(`Upload success! ${data.location}`);
                return undefined;
            } else if (res.status === 409) {
                return `Looks like ${fileName} a duplicate replay, you can find it at ${data.location}`;
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            throw new Error(error.message.trim());
        }
    }

    async download(url: string): Promise<Buffer> {
        console.log(`Attempting to download ${url}`);

        try {
            const res = await fetch(url);

            if (res.status !== 200) {
                throw res;
            }

            const file = await res.arrayBuffer();
            return Buffer.from(file);
        } catch (error) {
            if (error.status) throw error;

            if (error instanceof TypeError) {
                throw new Error('Url is not reachable');
            }

            throw new Error(error);
        }
    }
}
