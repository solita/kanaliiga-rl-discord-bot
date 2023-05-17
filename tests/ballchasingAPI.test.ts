import { fetchGroups } from "../src/ballchasingAPI";
import { mockResponse } from "./testHelpers";



describe("Ballchasing Api", () => {

    

    it("Fetches the groups from ballchasing API", async () => {

        global.fetch = jest.fn().mockImplementationOnce(() => {
            return Promise.resolve(mockResponse)
        })


        const response = await fetchGroups()

        expect(response).toBeDefined()
        expect(response[0].id).toBe("12345Test")

    })

    // TODO: more tests


})




