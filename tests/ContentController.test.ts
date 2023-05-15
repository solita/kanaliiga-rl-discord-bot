import { ThreadChannel } from "discord.js";
import { ContentController } from "../src/ContentController";
import { mockMessage } from "./PostJob.test";
import { ACCEPTABLE_FILE_EXTENSION } from "../src/util";




describe("Content controller", () => {

    const controller = new ContentController()

    const mockThread = (id: string) => {

        return {
            id: id,
            name: 'postTitle'
        } as ThreadChannel

    }

    beforeEach(() => {
        controller.clearTasks()
    })

    it("New instance of Controller and documentProcessor is defined", () => {
        expect(controller).toBeDefined()
    })


    it("New PostJobs are created and added to controllers queue", async () => {

        const TASK_COUNT = 4

        for (let i = 0; i < TASK_COUNT; i++) {
            await controller.createNewTask(mockThread(String(i)))
        }

        expect(controller.tasks.length).toBe(TASK_COUNT)
        expect(controller.tasks[0].thread.id).toBe('0')
        expect(controller.tasks[3].thread.id).toBe('3')

        expect(controller.tasks[0].groupId).toBeDefined()
        expect(controller.tasks[3].groupId).toBeDefined()

        expect(controller.tasks[0].queue.length).toBe(0)
        expect(controller.tasks[3].queue.length).toBe(0)

    })


    it("Add Messages to a specific PostJob's queue", async () => {

        await controller.createNewTask(mockThread('mock1'))
        await controller.createNewTask(mockThread('mock2'))

        for (let i = 0; i < 3; i++) {
            await controller.addToPostQueue(mockMessage('first' + String(i), 3, 'mock1'))
            await controller.addToPostQueue(mockMessage('second' + String(i), 3, 'mock2'))
        }

        expect(controller.tasks[0].size()).toBe(3)
        expect(controller.tasks[1].size()).toBe(3)
        expect(controller.tasks[0].queue[0].attachments.get('File 0').url).toBe("URL /0"+ACCEPTABLE_FILE_EXTENSION)
        expect(controller.tasks[1].queue[2].attachments.get('File 2').url).toBe("URL /2"+ACCEPTABLE_FILE_EXTENSION)

    })

    it("Does not add messages with wrong file extensions", async () => {

        await controller.createNewTask(mockThread('mock1'))


        for (let i = 0; i < 3; i++) {
            await controller.addToPostQueue(mockMessage('first' + String(i), 1, 'mock1', true))
        }

        expect(controller.tasks[0].size()).toBe(0)


    })


    it("New postjob is created if it doesnt exist when adding new new message to its queue", async () => {

        await controller.addToPostQueue(mockMessage('messageid1', 2, 'channeldId1'))

        expect(controller.tasks.length).toBe(1)
        expect(controller.tasks[0].size()).toBe(1)
        expect(controller.tasks[0].thread.id).toBe('channeldId1')
        expect(controller.tasks[0].queue[0].attachments.size).toBe(2)
        expect(controller.tasks[0].queue[0].attachments.get('File 1').url).toBe("URL /1"+ACCEPTABLE_FILE_EXTENSION)


    })
    

    it("Processing of each PostJobs queue of URL's", async () => {

        await controller.createNewTask(mockThread('mock1'))
        await controller.createNewTask(mockThread('mock2'))

        for (let i = 0; i < 3; i++) {
            await controller.addToPostQueue(mockMessage('first' + String(i), 3, 'mock1'))
            await controller.addToPostQueue(mockMessage('second' + String(i), 3, 'mock2'))
        }

        controller.processQueue()

        await new Promise((r) => setTimeout(r, 200));

        expect(controller.tasks.length).toBe(2)
        expect(controller.tasks[0].size()).toBe(0)
        expect(controller.tasks[1].size()).toBe(0)

    })

    // // TODO: Test for removing a PostJob from tasks list if its empty and old enough

})

