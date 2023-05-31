import * as dotenv from 'dotenv';
import fs from 'fs';
import log from './log';

dotenv.config();

export const TOKEN = process.env.TOKEN || 'NO TOKEN SET';
export const CLIENT_ID = process.env.CLIENT_ID || 'NO CLIENT ID SET';

export const BALL_CHASING_API_KEY =
    process.env.BALL_CHASING_API_KEY || 'NO CLIENT ID SET';

export const TARGET_CHANNEL_NAME =
    process.env.TARGET_CHANNEL_NAME || 'NO TARGET CHANNEL SET';

export const APPLICATION_VERSION =
    process.env.npm_package_version || 'VERSION NOT SET';

export const CAPTAIN_ROLE = process.env.CAPTAIN_ROLE || 'CAPTAIN ROLE NOT SET';

export const bcParentGroup = (newName?: string): string | boolean => {
    if (!newName) {
        try {
            return fs.readFileSync('parentGroup.txt').toString().trim();
        } catch (error) {
            log.error(error);
            return 'err';
        }
    } else {
        try {
            fs.writeFileSync('parentGroup.txt', newName);
            return true;
        } catch (error) {
            log.error(error);
            return false;
        }
    }
};

export const clearCacheInterval =
    Number(process.env.CLEAR_CACHE_INTERVAL) * (24 * 60 * 60 * 1000) ||
    undefined;
//convert to milliseconds for date objects

export const ADMIN_ROLE = process.env.ADMIN_ROLE || 'ADMIN ROLE NOT FOUND';

export const MAX_NUM_POSTS = Number(process.env.MAX_NUM_POSTS) || 7;

export const BOT_NAME = process.env.BOT_NAME || 'Kanaliiga RL Bot';

export const BOT_ACTIVITY =
    process.env.BOT_ACTIVITY || 'for RL replays to upload...';
