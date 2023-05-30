import { Attachment, Collection, Message } from 'discord.js';
import {
    parseFileExtension,
    allAttahcmentsAreCorrectType,
    getDivisionName,
    checkDateObject,
    getAttachmentCount
} from '../src/util';
import { mockMessage } from './testHelpers';

describe('Utilities', () => {
    const testURLs = [
        'www.test.com/best_content_ever.jpg',
        'www.test.com/test.file.extension.replay',
        'www.test.com/test_file-extension/file.html'
    ];

    it('Parses the file extensions from url correctly', () => {
        expect(parseFileExtension(testURLs[0])).toBe('.jpg');
        expect(parseFileExtension(testURLs[1])).toBe('.replay');
        expect(parseFileExtension(testURLs[2])).toBe('.html');
    });

    it('Checks that each attachment is correct file in an Map', () => {
        const testMapBad = new Collection<string, Attachment>([
            [
                'File0',
                {
                    url: 'www.test.com/best_content_ever.jpg'
                } as unknown as Attachment
            ],
            [
                'File1',
                {
                    url: 'www.test.com/best_content_ever.replay'
                } as unknown as Attachment
            ],
            [
                'File2',
                {
                    url: 'www.test.com/best_content_ever.replay'
                } as unknown as Attachment
            ]
        ]);

        const testMapGood = new Collection<string, Attachment>([
            [
                'File0',
                {
                    url: 'www.test.com/best_content_ever.replay'
                } as unknown as Attachment
            ],
            [
                'File1',
                {
                    url: 'www.test.com/best_content_ever.replay'
                } as unknown as Attachment
            ],
            [
                'File2',
                {
                    url: 'www.test.com/best_content_ever.replay'
                } as unknown as Attachment
            ]
        ]);

        expect(allAttahcmentsAreCorrectType(testMapBad)).toBe(false);
        expect(allAttahcmentsAreCorrectType(testMapGood)).toBe(true);
    });

    it("Checks that the division name can be parsed, and returns undefined if post title doesn't follow naming convention", () => {
        const goodPostTitle =
            'Solita Ninja vs Solita Herkku, Challengers, 1.5.2023';
        const badPostTitle = 'replayfile for ballchasing';

        expect(getDivisionName(goodPostTitle)).toBe('Challengers');
        expect(getDivisionName(badPostTitle)).toBeUndefined();
    });

    it('Returns true if the given timestamp is older than 3 days (259200000 ms)', () => {
        const dateToCheck = checkDateObject(
            new Date('2023-05-17T07:34:16.061Z'),
            259200000
        );
        expect(dateToCheck).toBe(true);
    });

    it('Returns the correct amount of attachments in a collection of messages', () => {
        const mockMessages = new Collection<string, Message>([
            ['msg', mockMessage('test', 3)],
            ['msg1', mockMessage('test1', 4)]
        ]);
        const numOfAttachments = getAttachmentCount(mockMessages);

        expect(numOfAttachments).toBe(7);
    });
});
