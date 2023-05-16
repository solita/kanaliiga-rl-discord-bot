import { fetchGroups } from "../src/ballchasingAPI";


export const mockResponse = {
    status: 200,
    json: jest.fn(()=> mockResponse),
    list: [{
        name: "league1",
        id: "12345Test",
        created: '2023-05-09T16:00:50.682781Z',
        link: 'https://ballchasing.com/api/groups/xxxxy',
    }, {
        name: "league2",
        id: "56789Test",
        created: '2023-02-09T16:00:50.682781Z',
        link: 'https://ballchasing.com/api/groups/yyyyyx',
    }]
} 

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




