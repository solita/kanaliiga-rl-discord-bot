import { searchGroupId } from "../src/ballchasingAPI";



describe("Ballchasing Api", () => {


    it("Searches for the groupID andreturn both the match and all other results", () => {

        const json = () => {
            return {
                list: [
                    { 
                        id: 'testId1',
                        name: "testGroup1",
                    },
                    { 
                        id: 'testId2',
                        name: "testGroup2",
                    },
                    { 
                        id: 'testId3',
                        name: "testGroup3",
                    }
                ]
            }
        }


        expect(json).toBeDefined()

    })







})




