import { Message, Role, ThreadChannel } from "discord.js"

import * as BCAPI from "../src/ballchasingAPI";
import { ACCEPTABLE_FILE_EXTENSION } from "../src/util";



export const mockMessage = (
    messageId: string, 
    attchmntCount = 1, 
    channelID = 'channelId0', 
    faulExtension = false, 
    ballchasingGroupId = 'group1', 
    isRLCaptain = true,) => {

    const files = new Map<string, object>()
    jest.spyOn(BCAPI, 'searchGroupId').mockImplementationOnce(()=> [ballchasingGroupId, []])

    for (let j = 0; j < attchmntCount; j++) {
        files.set('File ' + j, { url: 'URL /' + j + (faulExtension ? '.test' : ACCEPTABLE_FILE_EXTENSION) })
    }

    const mockRole: Role = {
        id: 'Test',
        name: isRLCaptain ? 'RL Captain' : ''
    } as unknown as Role

    return {
        id: messageId,
        attachments: files,
        channel: {
            name: 'Solita Ninja vs Solita Herkku, Challengers, 1.5.2023',
            id: channelID,
            sendTyping: jest.fn(() => Promise<void>),
            send: jest.fn(() => Promise<void>)
        },
        react: jest.fn(() => Promise<void>),
        member: {
            roles: {
                cache: [
                    mockRole
                ]
            }
        }
    } as unknown as Message
}


export const mockThread = (id: string, ballchasingGroupId = 'group1') => {
    jest.spyOn(BCAPI, 'searchGroupId').mockImplementationOnce(()=> [ballchasingGroupId, []])
    return {
        id: id,
        name: 'Solita Ninja vs Solita Herkku, Challengers, 1.5.2023',
        send: jest.fn(()=> Promise.resolve())
    } as unknown as ThreadChannel

}
