import { BALL_CHASING_API_KEY, bcParentGroup } from './config';

const BALLCHASING_BASEURL = 'https://ballchasing.com/api';

export type TBallchasingGroup = {
    name?: string;
    id: string;
    created?: string;
    link: string;
    [key: string]: string | object;
};



export const pingBCApi = (): Promise<Response> => {
    return fetch(BALLCHASING_BASEURL, {
        headers: {
            Authorization: BALL_CHASING_API_KEY
        }
    })
        .then((resp) => resp)
        .catch((err) => err);
};

export const fetchGroups = (parentGroup:string): Promise<Array<TBallchasingGroup>> => {
    return fetch(`${BALLCHASING_BASEURL}/groups?group=${parentGroup}`, {
        headers: {
            Authorization: BALL_CHASING_API_KEY
        }
    })
        .then((resp) => {
            if (resp.status !== 200) {
                throw resp;
            }
            return resp.json();
        })
        .then((body) => body.list);
};

export const searchGroupId = (
    name: string,
    groups: TBallchasingGroup[]
): [TBallchasingGroup | undefined, string[]] => {
    return [
        groups.find((record) => record.name === name),
        groups.map((record) => record.name)
    ];
};


const createNewSubgroup = (parentId: string, groupName: string):Promise<TBallchasingGroup> =>{

    const payload = {
        name: groupName,
        parent: parentId,
        player_identification: "by-id",
        team_identification: "by-player-clusters"
    }


    return fetch(BALLCHASING_BASEURL+'/groups', {
        method: "POST",
        headers: {
            Authorization: BALL_CHASING_API_KEY
        },
        body: JSON.stringify(payload),
    }).then(resp =>{
        if(resp.status !== 201){
            throw resp
        }
        return resp.json()
    })

}

export const checkOrCreateSubgroup = async (parentGroup: string, groupName: string):
 Promise<TBallchasingGroup> => {

    try {
        const data = await createNewSubgroup(parentGroup, groupName)
        return data
    } catch (error) {
        
        if (error.status && error.status === 400){
            const existingGroups = await fetchGroups(parentGroup)
            return searchGroupId(groupName, existingGroups)[0]
        }
        throw error
    }
}



export const reportBcApiConnection = async () => {
    const res = await pingBCApi();
    if (res.status === 200) {
        return `Connection to Ballchasing API is OK! (${res.status})`;
    }

    return `We encountered a problem with Ballchasing API. ${res.url} - ${res.status} - ${res.statusText}`;
};
