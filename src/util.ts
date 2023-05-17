import { Attachment, Collection } from "discord.js";

const reFileExtension = /(?:\.([^.]+))?$/;
export const ACCEPTABLE_FILE_EXTENSION = ".replay"


export const parseFileExtension = (fileName: string) => {
    return `.${reFileExtension.exec(fileName)[1]}`
}

export const allAttahcmentsAreCorrectType =
    (attachments: Collection<string, Attachment>): boolean => {
        return attachments.some(att => parseFileExtension(att.url) !== ACCEPTABLE_FILE_EXTENSION)
    }



export const getDivisionName = (postTitle: string) => {
    const splitString = postTitle.split(', ')
    //splits into array to get division name, for example: [ 'Solita Ninja vs Solita Herkku', 'Challengers', '1.5.2023' ]
    const postTitleDivisionName = splitString[1]
    return postTitleDivisionName
}    
