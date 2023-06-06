import { DocumentProcessor } from '../src/DocumentProcessor';
import {
    mockResponseForUploadSuccess,
    mockResponseForUploadFail
} from './testHelpers';

describe('Document processor', () => {
    const processor = new DocumentProcessor();

    it('Document processor is defined', () => {
        expect(processor).toBeDefined();
    });

    it('File uploads from buffer (status 201)', async () => {
        global.fetch = jest.fn().mockImplementationOnce(() => {
            return Promise.resolve(mockResponseForUploadSuccess);
        });

        const res = await processor.upload(
            Buffer.from([]),
            'test-replay.replay',
            'test-group-ID'
        );
        expect(res).toBeUndefined();
    });

    it('File uploads from buffer (status 500)', async () => {
        global.fetch = jest.fn().mockImplementationOnce(() => {
            return mockResponseForUploadFail;
        });

        try {
            await processor.upload(
                Buffer.from([]),
                'test-replay.replay',
                'test-group-ID'
            );
        } catch (err) {
            expect(err.message).toBe(mockResponseForUploadFail.error);
        }
    });

    it('Downloads a file given an url (status 200)', async () => {
        global.fetch = jest.fn().mockImplementationOnce(() => {
            return Promise.resolve(
                new Response(Buffer.from([24]), { status: 200 })
            );
        });

        const file = await processor.download('url.com');
        expect(file).toStrictEqual(Buffer.from([24]));
    });

    it('Downloads a file given an url (status != 200)', async () => {
        global.fetch = jest.fn().mockImplementationOnce(() => {
            return Promise.resolve(
                new Response(Buffer.from([24]), {
                    status: 404,
                    statusText: 'jep'
                })
            );
        });

        try {
            await processor.download('url.com');
        } catch (error) {
            expect(error.status).toBe(404);
            expect(error.statusText).toBe('jep');
        }
    });
});
