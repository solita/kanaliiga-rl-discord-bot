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

    it("Upload a replay file to Ballchasing", async() => {
        const testBuffer = Buffer.alloc(5)
        const res = await processor.upload(testBuffer);
        const data = await res.json()
        expect(res).toBeDefined();
        expect(data).toBeDefined();

        if (res.status === 500 || 400) {
            console.log(data)
            expect(data).toHaveProperty('error')
        } else {
            expect(data).toHaveProperty('id')
            expect(data).toHaveProperty('location')
        }
    })
})