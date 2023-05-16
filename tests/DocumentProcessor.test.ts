import { DocumentProcessor } from "../src/DocumentProcessor";

describe("Document processor", () => {
    const url = 'https://media.discordapp.net/attachments/1106549031691362404/1106549107209801728/Screenshot_2023-03-15_at_8.32.30.png'

    const processor = new DocumentProcessor()

    it("Document processor is defined", () => {
        expect(processor).toBeDefined()
    })

    it("Downloads a file into a buffer", async () => {
        const buffer = await processor.download(url)
        expect(buffer).toBeDefined();
    })
})
