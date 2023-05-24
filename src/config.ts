import * as dotenv from 'dotenv';
import fs from 'fs';
import { fetchGroups } from './ballchasingAPI';
import { GuildTextBasedChannel } from 'discord.js';

dotenv.config();

export const TOKEN = process.env.TOKEN || 'NO TOKEN FOUND';
export const CLIENT_ID = process.env.CLIENT_ID || 'NO CLIENT ID FOUND';

export const BALL_CHASING_API_KEY =
    process.env.BALL_CHASING_API_KEY || 'NO CLIENT ID FOUND';

export const APPLICATION_VERSION =
    process.env.npm_package_version || 'VERSION NOT FOUND';

export const CAPTAIN_ROLE =
    process.env.CAPTAIN_ROLE || 'CAPTAIN ROLE NOT FOUND';

export const bcParentGroup = async (
    newName?: string,
    channel?: GuildTextBasedChannel
): Promise<string | boolean> => {
    if (!newName) {
        try {
            return fs.readFileSync('parentGroup.txt').toString().trim();
        } catch (error) {
            return 'err';
        }
    } else {
        try {
            fs.writeFileSync('parentGroup.txt', newName);
            try {
                const list = await fetchGroups();
                if (list?.length < 1) {
                    channel.send(
                        '⚠️**Warning:** Parent group might not exist or is empty.'
                    );
                    return true;
                }
            } catch {
                return true;
            }
            return true;
        } catch (error) {
            return false;
        }
    }
};

export const clearCacheInterval =
    Number(process.env.CLEAR_CACHE_INTERVAL) * (24 * 60 * 60 * 1000) ||
    undefined;
//convert to milliseconds for date objects

export const ADMIN_ROLE = process.env.ADMIN_ROLE || 'ADMIN ROLE NOT FOUND';
