import { BALL_CHASING_API_KEY } from "./config";
import log from "./log"
import https from 'https'
import FormData from 'form-data';
//import fs from 'fs'
//import path from 'path'

export class DocumentProcessor {
    filePath: string

    constructor() {
        this.filePath = './temp'
    }

    async upload(replay: Buffer): Promise<Response> {
        log.info(`Uploading....`)
        const url = 'https://ballchasing.com/api/v2/upload?visibility=private';
        const form = new FormData();
        form.append('file', replay)
        //console.log(form)
        return new Promise(async (resolve, reject) => {
            try {
                const res = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Authorization': BALL_CHASING_API_KEY,
                        'Content-Type': 'multipart/form-data; boundary='+form.getBoundary()
                    },
                    //body: form
                })
                resolve(res)
            } catch (err) {
                console.error(err)
                reject(err)
            }
        })
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