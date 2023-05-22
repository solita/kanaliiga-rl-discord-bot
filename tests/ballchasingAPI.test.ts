import { fetchGroups, searchGroupId } from "../src/ballchasingAPI";
import { mockResponseForGroups } from "./testHelpers";



describe("Ballchasing Api", () => {

    /*
    These tests depend on mockResponseForGroups from testHelpers.ts

    Please see the mockresponseFormockResponseForGroups for more details on existing mocked groups
    */

    it("Fetches the groups from ballchasing API", async () => {

        global.fetch = jest.fn().mockImplementationOnce(() => {
            return Promise.resolve(mockResponseForGroups)
        })


        const response = await fetchGroups()

        expect(response).toBeDefined()
        expect(response[0].id).toBe("12345Test")

    })


    it("Parses the group fetch response into: [possibleMatch, [other, results]]", async()=>{

        global.fetch = jest.fn().mockImplementationOnce(() => {
            return Promise.resolve(mockResponseForGroups)
        })


        const response = await fetchGroups()

        const [matchId, allResults] = searchGroupId('Challengers',response)

        expect(matchId).toBe('12345Test')
        expect(allResults[0]).toBe('Challengers')
        expect(allResults[1]).toBe('league2')


    })


})




