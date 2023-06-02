import { ContentController } from '../src/ContentController';
import { mockMessage, mockThread } from './testHelpers';
import * as util from '../src/util';
import * as BCAPI from '../src/ballchasingAPI';
import { mockResponseForGroups } from './testHelpers';
import { DocumentProcessor } from '../src/DocumentProcessor';
import PostJob from '../src/PostJob';

describe('Content controller', () => {
    const controller = new ContentController();

    beforeEach(() => {
        controller.clearTasks();
        jest.spyOn(PostJob.prototype, 'sendCloseReminder').mockImplementation(
            async () => {
                Promise.resolve();
            }
        );
        jest.useFakeTimers({ advanceTimers: 90 });
        jest.spyOn(BCAPI, 'fetchGroups').mockImplementation(() =>
            Promise.resolve(mockResponseForGroups.list)
        );
        jest.spyOn(DocumentProcessor.prototype, 'download').mockImplementation(
            () => Promise.resolve(Buffer.from([0]))
        );
        jest.spyOn(DocumentProcessor.prototype, 'upload').mockImplementation(
            () => Promise.resolve('url')
        );
    });
    afterAll(() => {
        jest.clearAllMocks();
    });

    it('New instance of Controller is defined', () => {
        expect(controller).toBeDefined();
    });

    it('New PostJobs are created and added to controllers queue', async () => {
        const TASK_COUNT = 4;

        for (let i = 0; i < TASK_COUNT; i++) {
            await controller.createNewTask(mockThread(String(i)));
        }

        expect(controller.tasks.length).toBe(TASK_COUNT);
        expect(controller.tasks[0].thread.id).toBe('0');
        expect(controller.tasks[3].thread.id).toBe('3');

        expect(controller.tasks[0].groupId).toBeDefined();
        expect(controller.tasks[3].groupId).toBeDefined();

        expect(controller.tasks[0].queue.length).toBe(0);
        expect(controller.tasks[3].queue.length).toBe(0);
    });

    it("With sufficient role: Add Messages to a specific PostJob's queue", async () => {
        await controller.createNewTask(mockThread('mock1', 'Group1'));
        await controller.createNewTask(mockThread('mock2', 'Group2'));

        for (let i = 0; i < 3; i++) {
            await controller.addToPostQueue(
                mockMessage('first' + String(i), 3, 'mock1')
            );
            await controller.addToPostQueue(
                mockMessage('second' + String(i), 3, 'mock2')
            );
        }

        expect(controller.tasks[0].size()).toBe(3);
        expect(controller.tasks[1].size()).toBe(3);
        expect(controller.tasks[0].queue[0].attachments.get('File 0').url).toBe(
            'URL /0' + util.ACCEPTABLE_FILE_EXTENSION
        );
        expect(controller.tasks[1].queue[2].attachments.get('File 2').url).toBe(
            'URL /2' + util.ACCEPTABLE_FILE_EXTENSION
        );
    });

    it("Without sufficient role: Add Messages to a specific PostJob's queue", async () => {
        await controller.createNewTask(mockThread('mock1', 'Group1'));

        for (let i = 0; i < 3; i++) {
            await controller.addToPostQueue(
                mockMessage('first' + String(i), 3, 'mock1', false, false)
            );
        }

        expect(controller.tasks[0].size()).toBe(0);
    });

    it('Does not add messages with wrong file extensions', async () => {
        await controller.createNewTask(mockThread('mock1'));

        for (let i = 0; i < 3; i++) {
            await controller.addToPostQueue(
                mockMessage('first' + String(i), 1, 'mock1', true)
            );
        }

        expect(controller.tasks[0].size()).toBe(0);
    });

    it('New postjob is created if it doesnt exist when adding new new message to its queue', async () => {
        await controller.addToPostQueue(mockMessage('messageid1', 2, 'postId'));
        expect(controller.tasks.length).toBe(1); // Task does not exist previously, so 1 was created
        expect(controller.tasks[0].size()).toBe(1); // That created task has 1 message in its queue
        expect(controller.tasks[0].thread.id).toBe('postId'); // message objects channel object populates threadId correctly
        expect(controller.tasks[0].queue[0].attachments.size).toBe(2); //The message we added to this newly created post, contains 2 attachments
        expect(controller.tasks[0].queue[0].attachments.get('File 1').url).toBe(
            'URL /1' + util.ACCEPTABLE_FILE_EXTENSION
        ); // the second attch's both file name and its url are in correct sequence, (last of the 2)
    });

    it("Processing of each PostJobs queue of URL's", async () => {
        await controller.createNewTask(mockThread('mock1', 'bcGroupId1'));
        await controller.createNewTask(mockThread('mock2', 'bcGroupId2'));

        for (let i = 0; i < 3; i++) {
            await controller.addToPostQueue(
                mockMessage('first' + String(i), 1, 'mock1')
            );
            await controller.addToPostQueue(
                mockMessage('second' + String(i), 1, 'mock2')
            );
        }

        controller.processQueue();

        await new Promise((r) => setTimeout(r, 200));

        expect(controller.tasks.length).toBe(2); //Thread itself does not get deleted

        //processed messages are removed from queue
        expect(controller.tasks[0].size()).toBe(0);
        expect(controller.tasks[1].size()).toBe(0);
    });

    it('Removes a PostJob from tasks if it is old and empty', async () => {
        for (let i = 0; i < 3; i++) {
            await controller.addToPostQueue(
                mockMessage('first' + String(i), 3, 'mock1')
            );
            await controller.addToPostQueue(
                mockMessage('second' + String(i), 0, 'mock2')
            );
        }
        controller.tasks[1].createdAt = new Date(
            '2023-05-17T07:34:16.061Z'
        ).getMilliseconds();
        controller.cleanUpTasks();
        expect(controller.tasks.length).toBe(1);
    });
});
