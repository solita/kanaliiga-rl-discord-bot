import { BALL_CHASING_API_KEY } from './config';

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

export const fetchGroups = (
    parentGroup: string
): Promise<Array<TBallchasingGroup>> => {
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

export const createNewSubgroup = (
    parentGroup: string,
    groupName: string
): Promise<TBallchasingGroup> => {
    const payload = {
        name: groupName,
        parent: parentGroup,
        player_identification: 'by-id',
        team_identification: 'by-player-clusters'
    };

    return fetch(BALLCHASING_BASEURL + '/groups', {
        method: 'POST',
        headers: {
            Authorization: BALL_CHASING_API_KEY
        },
        body: JSON.stringify(payload)
    }).then((resp) => {
        if (resp.status !== 201) {
            throw resp;
        }
        return resp.json();
    });
};

export const reportBcApiConnection = async () => {
    const res = await pingBCApi();
    if (res.status === 200) {
        return `Connection to Ballchasing API is OK! (${res.status})`;
    }

    return `We encountered a problem with Ballchasing API. ${res.url} - ${res.status} - ${res.statusText}`;
};
