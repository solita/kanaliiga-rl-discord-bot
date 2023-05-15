import * as dotenv from 'dotenv';
dotenv.config();

export const TOKEN = process.env.TOKEN || 'NO TOKEN FOUND';
export const CLIENT_ID = process.env.CLIENT_ID || 'NO CLIENT ID FOUND';
export const BC_API_KEY = process.env.BC_API_KEY || 'NO CLIENT ID FOUND';
export const BC_SEASON_PARENT_GROUP_ID = process.env.BC_SEASON_PARENT_GROUP_ID || 'NO CLIENT ID FOUND';
