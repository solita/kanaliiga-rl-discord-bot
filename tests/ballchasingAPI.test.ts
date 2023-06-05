import { fetchGroups, searchGroupId } from '../src/ballchasingAPI';
import { bcParentGroup } from '../src/config';
import { mockResponseForGroups } from './testHelpers';

describe('Ballchasing Api', () => {
    /*
    These tests depend on mockResponseForGroups from testHelpers.ts

    Please see the mockresponseFormockResponseForGroups for more details on existing mocked groups
    */

    it('Fetches the groups from ballchasing API', async () => {
        global.fetch = jest.fn().mockImplementationOnce(() => {
            return Promise.resolve(mockResponseForGroups);
        });

        const response = await fetchGroups(bcParentGroup());

        expect(response).toBeDefined();
        expect(response[0].id).toBe('12345Test');
    });

    it('Parses the group fetch response into: [possibleMatch, [other, results]]', async () => {
        global.fetch = jest.fn().mockImplementationOnce(() => {
            return Promise.resolve(mockResponseForGroups);
        });

        const response = await fetchGroups(bcParentGroup());

        const [match, allResults] = searchGroupId('Challengers', response);

        expect(match.id).toBe('12345Test');
        expect(allResults[0]).toBe('Challengers');
        expect(allResults[1]).toBe('league2');
    });
});
