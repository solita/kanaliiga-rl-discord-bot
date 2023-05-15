import { BALL_CHASING_API_KEY, BC_SEASON_PARENT_GROUP_ID } from "./config"


const BALLCHASING_BASEURL = 'https://ballchasing.com/api'

export const ping = () =>{

    return fetch(BALLCHASING_BASEURL,{
        headers: {
            "Authorization": BALL_CHASING_API_KEY,
        },
    }).then(resp => `Connection to Ballchasing API is ${resp.status}`)
    
}

export const searchGroupId = async (name:string) =>{

    const results = await fetch(`${BALLCHASING_BASEURL}/groups?group=${BC_SEASON_PARENT_GROUP_ID}`,{
        headers: {
            "Authorization": BALL_CHASING_API_KEY,
        },
    })

    const subGroups = await results.json()
    return [subGroups.list.find((record: { name: string }) => record.name === name), subGroups]

}