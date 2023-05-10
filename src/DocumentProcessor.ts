export class DocumentProcessor {
    async upload(file:string) {
        console.log(`Uploading:  ${file}`)
        return true
    }
    async download(url: string) {
        return 'video.mp4'
    }
}