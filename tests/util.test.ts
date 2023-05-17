import { Attachment, Collection } from "discord.js";
import { parseFileExtension, allAttahcmentsAreCorrectType, getDivisionName } from "../src/util";





describe("Utilities", ()=>{

    const testURLs = [
        'www.test.com/best_content_ever.jpg',
        'www.test.com/test.file.extension.replay',
        'www.test.com/test_file-extension/file.html',
    ]

    it("Parses the file extensions from url correctly", () =>{

        expect(parseFileExtension(testURLs[0])).toBe('.jpg')
        expect(parseFileExtension(testURLs[1])).toBe('.replay')
        expect(parseFileExtension(testURLs[2])).toBe('.html')
    })


    it("Checks that each attachment is correct file in an Map", () =>{

        

        const testMapBad = new Collection<string, Attachment>([
            ['File0',  {url:'www.test.com/best_content_ever.jpg'} as unknown as Attachment],
            ['File1',  {url:'www.test.com/best_content_ever.replay'} as unknown as Attachment],
            ['File2',  {url:'www.test.com/best_content_ever.replay'} as unknown as Attachment]
        ]) 

        const testMapGood = new Collection<string, Attachment>([
            ['File0',  {url:'www.test.com/best_content_ever.replay'} as unknown as Attachment],
            ['File1',  {url:'www.test.com/best_content_ever.replay'} as unknown as Attachment],
            ['File2',  {url:'www.test.com/best_content_ever.replay'} as unknown as Attachment]
        ])

        expect(allAttahcmentsAreCorrectType(testMapBad)).toBe(false)
        expect(allAttahcmentsAreCorrectType(testMapGood)).toBe(true)

    })

    it("Checks that the division name can be parsed, and returns undefined if post title doesn't follow naming convention", () => {
        const goodPostTitle = 'Solita Ninja vs Solita Herkku, Challengers, 1.5.2023';
        const badPostTitle = 'replayfile for ballchasing';

        expect(getDivisionName(goodPostTitle)).toBe('Challengers');
        expect(getDivisionName(badPostTitle)).toBeUndefined();
    })
})