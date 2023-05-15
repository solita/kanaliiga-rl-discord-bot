import * as dotenv from 'dotenv';
dotenv.config();

export const TOKEN = process.env.TOKEN || 'NO TOKEN FOUND';
export const CLIENT_ID = process.env.CLIENT_ID || 'NO CLIENT ID FOUND';
export const BALL_CHASING_API_KEY = process.env.BALL_CHASING_API_KEY || 'NO BALL CHASING API KEY FOUND';