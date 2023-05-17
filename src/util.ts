import { Attachment, Collection, Message } from "discord.js";

const reFileExtension = /(?:\.([^.]+))?$/;
export const ACCEPTABLE_FILE_EXTENSION = ".replay"


export const parseFileExtension = (fileName: string) => {
    return `.${reFileExtension.exec(fileName)[1]}`
}

export const allAttahcmentsAreCorrectType =
    (attachments: Collection<string, Attachment>): boolean => {

        
        for (const value of attachments) {
            
            if (parseFileExtension(value[1].url) !== ACCEPTABLE_FILE_EXTENSION) {
                return false
            }
        }

        return true
    }


export const getDivisionName = (postTitle: string) => {
    const splitString = postTitle.split(', ')
    //splits into array to get division name, for example: [ 'Solita Ninja vs Solita Herkku', 'Challengers', '1.5.2023' ]
    const postTitleDivisionName = splitString[1]
    return postTitleDivisionName
}

export const checkRoleIsRLCaptain = (message: Message) => {
    const getRoles = message.member

    if (getRoles) {
        const roles = getRoles.roles;
        if (!roles.cache.some(role => role.name === 'RL Captain')) {
            message.channel.send("Only those with `RL Captain` as their role can upload replays.")
            message.react('🚫')
            return false
        }
        return true 
    }
    return false
}
