import PostJob from '../src/PostJob';
import log from '../src/log';
import { DocumentProcessor } from '../src/DocumentProcessor';
import * as pkg from '../src/util';
import { mockMessage, mockThread } from './testHelpers';
import { TBallchasingGroup } from '../src/ballchasingAPI';

describe('Each postjob contains an array of discords Message objects', () => {
    const groupId_Test = 'Test_groupId';
    const threadId_Test = 'Test_threadId';

    const postJob = new PostJob(
        mockThread(threadId_Test, groupId_Test),
        groupId_Test
    );

    beforeEach(() => {
        postJob.clearQueue();
        jest.useFakeTimers({ advanceTimers: 90 });

        jest.spyOn(pkg, 'getAttachmentCount').mockImplementation(() => 0);
        jest.spyOn(PostJob.prototype, 'sendLinkAndReminder').mockImplementation(
            async () => {
                Promise.resolve();
            }
        );
        jest.spyOn(DocumentProcessor.prototype, 'download').mockImplementation(
            () => new Promise((r) => setTimeout(() => r(Buffer.from([])), 10))
        );
        jest.spyOn(DocumentProcessor.prototype, 'upload').mockImplementation(
            () => new Promise((r) => setTimeout(() => r('Location.com'), 10))
        );
    });

    afterAll(() => {
        jest.clearAllMocks();
        jest.clearAllTimers();
    });

    it('Creating of an empty new queue worked', () => {
        expect(postJob.size()).toBe(0);
        expect(postJob.groupId).toBe(groupId_Test);
        expect(postJob.thread.id).toBe(threadId_Test);
    });

    it('Adds new Messages to a queue', async () => {
        /*
        Adding 3 mockMessages, attachments is a Map {attachments: {'File i':'URL i'}}
        */

        for (let i = 0; i < 3; i++) {
            await postJob.addToQueue(mockMessage(String(i), 1));
        }

        expect(postJob.size()).toBe(3);

        expect(postJob.queue[0].id).toBe('0');
        expect(postJob.queue[2].id).toBe('2');
        expect(postJob.queue[0].attachments.get('File 0').url).toBe(
            'URL /0' + pkg.ACCEPTABLE_FILE_EXTENSION
        );
        expect(postJob.queue[2].attachments.get('File 0').url).toBe(
            'URL /0' + pkg.ACCEPTABLE_FILE_EXTENSION
        );
    });

    it('Does not add a new Message to the queue if one already exists, and logs it', async () => {
        const errorSpy = jest.spyOn(log, 'error');
        await postJob.addToQueue(mockMessage('messageId'));
        expect(postJob.size()).toBe(1);
        await postJob.addToQueue(mockMessage('messageId'));

        expect(errorSpy).toHaveBeenCalled();
        expect(postJob.size()).toBe(1);

        expect(postJob.queue[0].id).toBe('messageId');
    });

    it('Dequeueing removes first from the queue and returns it', async () => {
        for (let i = 0; i < 3; i++) {
            await postJob.addToQueue(mockMessage(String(i)));
        }
        postJob.removeFromQueue();
        expect(postJob.size()).toBe(2);

        postJob.removeFromQueue();
        expect(postJob.size()).toBe(1);
    });

    it('Processing dequeues messages, calls the upload and download function in the postjob', async () => {
        const message1 = mockMessage('id1', 1);
        const message2 = mockMessage('id2', 1);
        postJob.subGroup = {
            name: 'Subgroup',
            id: '123'
        } as unknown as TBallchasingGroup;

        await postJob.addToQueue(message1);
        await postJob.addToQueue(message2);

        expect(postJob.size()).toBe(2);

        postJob.process();

        await new Promise((r) => setTimeout(r, 4000));

        expect(postJob.size()).toBe(0);
        expect(postJob.processor.download).toBeCalledTimes(2);
        expect(postJob.processor.upload).toBeCalledTimes(2);
    });
});
