import {
    Attachment,
    Collection,
    Message,
    Role,
    ThreadChannel
} from 'discord.js';

import * as BCAPI from '../src/ballchasingAPI';
import { ACCEPTABLE_FILE_EXTENSION } from '../src/util';
import { CAPTAIN_ROLE } from '../src/config';

export const mockMessage = (
    messageId: string,
    attchmntCount = 1,
    channelID = 'channelId0',
    faulExtension = false,
    isRLCaptain = true
) => {
    const files = new Collection<string, Attachment>();

    for (let j = 0; j < attchmntCount; j++) {
        files.set('File ' + j, {
            url:
                'URL /' +
                j +
                (faulExtension ? '.test' : ACCEPTABLE_FILE_EXTENSION)
        } as Attachment);
    }

    const mockRole = new Collection<string, Role>([
        ['testRoleId', { name: isRLCaptain ? CAPTAIN_ROLE : '' } as Role]
    ]);

    return {
        id: messageId,
        attachments: files,
        channel: mockThread(channelID),
        react: jest.fn(() => Promise<void>),
        member: {
            roles: {
                cache: mockRole
            }
        }
    } as unknown as Message;
};

export const mockThread = (
    id: string,
    ballchasingGroupId = 'group1',
    hasMessages = false
) => {
    jest.spyOn(BCAPI, 'searchGroupId').mockImplementationOnce(() => [
        ballchasingGroupId,
        []
    ]);

    const msgs = hasMessages
        ? new Collection<string, Message>([
              ['msgid1', mockMessage('1', 1)],
              ['msgid2', mockMessage('2', 1)]
          ])
        : new Collection<string, Message>([]);

    return {
        id: id,
        name: 'Solita Ninja vs Solita Herkku, Challengers, 1.5.2023',
        sendTyping: jest.fn(() => Promise<void>),
        send: jest.fn(() => Promise.resolve()),
        messages: {
            fetch: jest.fn(() => new Promise((r) => r(msgs)))
        }
    } as unknown as ThreadChannel;
};

export const mockResponseForGroups = {
    status: 200,
    json: jest.fn(() => mockResponseForGroups),
    list: [
        {
            name: 'Challengers',
            id: '12345Test',
            created: '2023-05-09T16:00:50.682781Z',
            link: 'https://ballchasing.com/api/groups/xxxxy'
        },
        {
            name: 'league2',
            id: '56789Test',
            created: '2023-02-09T16:00:50.682781Z',
            link: 'https://ballchasing.com/api/groups/yyyyyx'
        }
    ]
};

export const mockResponseForUploadSuccess = {
    status: 201,
    json: jest.fn(() => mockResponseForUploadSuccess),
    id: '12345Test',
    location: 'https://ballchasing.com/replay/test'
};

export const mockResponseForUploadFail = {
    status: 500,
    json: jest.fn(() => mockResponseForUploadFail),
    error: 'Something went wrong!'
};
