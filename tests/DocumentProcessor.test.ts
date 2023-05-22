import { DocumentProcessor } from "../src/DocumentProcessor";
import { mockResponseForUploadSuccess, mockResponseForUploadFail } from "./testHelpers";

describe("Document processor", () => {

    const processor = new DocumentProcessor()

    it("Document processor is defined", () => {
        expect(processor).toBeDefined()
    })

    it('File uploads from buffer (status 201)', async() => {
        global.fetch = jest.fn().mockImplementationOnce(() => {
            return Promise.resolve(mockResponseForUploadSuccess)
        })

        const res = await processor.upload(Buffer.from([]), 'test-replay.replay', 'test-group-ID')

        expect(res).toBe(mockResponseForUploadSuccess.location)
    })

    it('File uploads from buffer (status 500)', async() => {
        global.fetch = jest.fn().mockImplementationOnce(() => {
            return Promise.reject(mockResponseForUploadFail)
        })

        const res = await processor.upload(Buffer.from([]), 'test-replay.replay', 'test-group-ID')
        console.log(res)
        expect(res).toBe(mockResponseForUploadFail.error);
    })
})
