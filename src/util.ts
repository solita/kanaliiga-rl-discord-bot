import { Attachment, Collection } from "discord.js";

const reFileExtension = /(?:\.([^.]+))?$/;
export const ACCEPTABLE_FILE_EXTENSION = ".replay"


export const parseFileExtension = (fileName: string) => {
    return `.${reFileExtension.exec(fileName)[1]}`
}

export const allAttahcmentsAreCorrectType =
    (attachments: Collection<string, Attachment>): boolean => {

        /* eslint-disable */
        for (const [_, value] of attachments) {
            /* eslint-enable */
            if (parseFileExtension(value.url) !== ACCEPTABLE_FILE_EXTENSION) {
                return false
            }
        }

        return true
    }

