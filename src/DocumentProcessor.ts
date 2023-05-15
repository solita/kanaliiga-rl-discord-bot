import { BALL_CHASING_API_KEY } from "./config";
import log from "./log"
import https from 'https'
//import fs from 'fs'
//import path from 'path'

export class DocumentProcessor {
    filePath: string

    constructor() {
        this.filePath = './temp'
    }

    async upload(replay: Buffer): Promise<any> {
        log.info(`Uploading....`)
        const url = 'https://ballchasing.com/api/v2/upload?visibility=private';
        const form = new FormData();
        form.append('data', new Blob([replay]), 'something.replay',)
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': BALL_CHASING_API_KEY,
                    'Content-Type':' multipart/form-data; boundary=---BOUNDARY'
                },
                body: form
            })

            const data = await res.json()
            return data
        } catch (err) {
            console.log(err)
        }
    }

    async download(url: string): Promise<any> {
        log.info(`Downloading file ${url}....`)
        return new Promise((resolve, reject) => {
            https.get(url, res => {
                if (res.statusCode !== 200) {
                    reject(`Failed to download file from ${url}`)
                    return
                }

                const chunks = []

                res.on('data', chunk => {
                    chunks.push(chunk)
                })

                res.on('end', () => {
                    const buffer = Buffer.concat(chunks)
                    resolve(buffer)
                })

                res.on('error', err => {
                    reject(err)
                })
            })
        })
    }
}