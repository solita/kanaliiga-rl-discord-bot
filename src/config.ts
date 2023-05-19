import * as dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

export const TOKEN = process.env.TOKEN || 'NO TOKEN FOUND';
export const CLIENT_ID = process.env.CLIENT_ID || 'NO CLIENT ID FOUND';

export const BALL_CHASING_API_KEY =
    process.env.BALL_CHASING_API_KEY || 'NO CLIENT ID FOUND';

export const APPLICATION_VERSION =
    process.env.npm_package_version || 'VERSION NOT FOUND';

export const CAPTAIN_ROLE =
    process.env.CAPTAIN_ROLE || 'CAPTAIN ROLE NOT FOUND';

export const bcParentGroup = (newName = '') => {
    if (!newName) {
        try {
            return fs.readFileSync('parentGroup.txt').toString().trim();
        } catch (error) {
            return 'err';
        }
    } else {
        try {
            fs.writeFileSync('parentGroup.txt', newName);
            return true;
        } catch (error) {
            return false;
        }
    }
};
