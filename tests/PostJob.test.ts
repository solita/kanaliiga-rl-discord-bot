import { ThreadChannel } from "discord.js";
import { PostJob } from "../src/PostJob";
import log from "../src/log";
import { DocumentProcessor } from "../src/DocumentProcessor";
import { ACCEPTABLE_FILE_EXTENSION } from "../src/util";
import { mockMessage } from "./testHelpers";

describe("Each postjob contains an array of discords Message objects", () => {

    const groupId_Test = 'Test_groupId'
    const threadId_Test = "Test_threadId"


    const mockThread = {
        id: threadId_Test,

    } as ThreadChannel

    const postJob = new PostJob(mockThread, groupId_Test)

    beforeEach(() => {
        postJob.clearQueue()
    })


    it("Creating of an empty new queue worked", () => {

        expect(postJob.size()).toBe(0)
        expect(postJob.groupId).toBe(groupId_Test)
        expect(postJob.thread.id).toBe(threadId_Test)


    })

    it("Adds new Messages to a queue", () => {

        /*
        Adding 3 mockMessages, attachments is a Map {attachments: {'File i':'URL i'}}
        */

        for (let i = 0; i < 3; i++) {
            postJob.addToQueue(mockMessage(String(i), 3))
        }

        expect(postJob.size()).toBe(3)

        expect(postJob.queue[0].id).toBe('0')
        expect(postJob.queue[2].id).toBe('2')
        expect(postJob.queue[0].attachments.get('File 0').url).toBe("URL /0" + ACCEPTABLE_FILE_EXTENSION)
        expect(postJob.queue[2].attachments.get('File 2').url).toBe("URL /2" + ACCEPTABLE_FILE_EXTENSION)

    })


    it("Adds new Messages to queue", () => {

        // Adding 3 mockMessages, attachments is a Map {attachments: {'File i':'URL i'}}
        for (let i = 0; i < 3; i++) {
            postJob.addToQueue(mockMessage(String(i), 3))
        }

        expect(postJob.size()).toBe(3)

        expect(postJob.queue[0].id).toBe('0')
        expect(postJob.queue[2].id).toBe('2')
        expect(postJob.queue[0].attachments.get('File 0').url).toBe("URL /0" + ACCEPTABLE_FILE_EXTENSION)
        expect(postJob.queue[2].attachments.get('File 2').url).toBe("URL /2" + ACCEPTABLE_FILE_EXTENSION)

    })


    it("Does not add a new Message to the queue if one already exists, and logs it", () => {



        const errorSpy = jest.spyOn(log, 'error')

        postJob.addToQueue(mockMessage('messageId'))
        expect(postJob.size()).toBe(1)
        postJob.addToQueue(mockMessage('messageId'))

        expect(errorSpy).toHaveBeenCalled()
        expect(postJob.size()).toBe(1)

        expect(postJob.queue[0].id).toBe('messageId')


    })

    it("Dequeueing removes first from the queue and returns it", () => {


        for (let i = 0; i < 3; i++) {
            postJob.addToQueue(mockMessage(String(i)))
        }

        postJob.removeFromQueue()
        expect(postJob.size()).toBe(2)

        postJob.removeFromQueue()
        expect(postJob.size()).toBe(1)

    })

    it("Processing dequeues messages, calls the upload and download function in the postjob", async () => {


        jest.spyOn(DocumentProcessor.prototype, 'download').mockImplementation(
            () => new Promise((r) => setTimeout(() => r(Buffer.from([])), 10)));
        jest.spyOn(DocumentProcessor.prototype, 'upload').mockImplementation(
            () => new Promise((r) => setTimeout(() => r('Location.com'), 10)));

        const message1 = mockMessage('id1', 3)
        const message2 = mockMessage('id2', 3)
        const message3 = mockMessage('id3', 3)


        postJob.addToQueue(message1)
        postJob.addToQueue(message2)
        postJob.addToQueue(message3)


        expect(postJob.size()).toBe(3)

        postJob.process()

        await new Promise((r) => setTimeout(r, 20))

        expect(postJob.size()).toBe(0)
        expect(postJob.processor.download).toBeCalledTimes(9)
        expect(postJob.processor.upload).toBeCalledTimes(9)


    })

    // TODO: Make tests where bad behaviour is being tested, "graceful error handling"





})








