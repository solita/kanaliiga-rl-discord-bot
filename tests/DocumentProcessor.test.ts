import { DocumentProcessor } from "../src/DocumentProcessor";
import fs from 'fs'
import log from "../src/log";

describe("Document processor", () => {
    const url = 'https://media.discordapp.net/attachments/1106549031691362404/1106549107209801728/Screenshot_2023-03-15_at_8.32.30.png'

    const processor = new DocumentProcessor()

    it("Document processor is defined", () => {
        expect(processor).toBeDefined()
    })

    it("Downloads a file into a buffer", async () => {
        const buffer = await processor.download(url)
        console.log(buffer)
        expect(buffer).toBeDefined();
    })

    it("Upload a replay file to Ballchasing", async() => {
        const data = fs.readFile('/src/Small_Giants_vs_Elisa_Fiffers_10052023_round_1.replay', async (err, buffer) => {
            if (err) {
                console.error(err)
                return
            }
            const data = await processor.upload(buffer)
            return data
        })
        
        expect(data).toBeDefined();
    })
})

//TODO MERGE FROM MAIN!!