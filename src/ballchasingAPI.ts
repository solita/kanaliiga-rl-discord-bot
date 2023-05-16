import { BALL_CHASING_API_KEY, BC_SEASON_PARENT_GROUP_ID } from "./config"


const BALLCHASING_BASEURL = 'https://ballchasing.com/api'

export type TBallchasingGroup = {
    name: string,
    id: string,
    created: string,
    link: string,
    [key: string]: string | object
}



export const pingBCApi = (): Promise<String> => {

    return fetch(BALLCHASING_BASEURL, {
        headers: {
            "Authorization": BALL_CHASING_API_KEY,
        },
    }).then(resp => `Connection to Ballchasing API is ${resp.status}`).catch(err => `An error occured: ${err.message}`)

}

export const fetchGroups = (): Promise<Array<TBallchasingGroup>> => {

    return fetch(`${BALLCHASING_BASEURL}/groups?group=${BC_SEASON_PARENT_GROUP_ID}`, {
        headers: {
            "Authorization": BALL_CHASING_API_KEY,
        },
    }).then(resp => {
        if (resp.status !== 200) {
            throw resp
        }
        return resp.json()
    })
        .then(body => body.list)

}

export const searchGroupId = (name: string, groups: TBallchasingGroup[])
    : [string | undefined, string[]] => {

    return [
        groups.find(record => record.name === name)?.id,
        groups.map(record => record.name)
    ]




}