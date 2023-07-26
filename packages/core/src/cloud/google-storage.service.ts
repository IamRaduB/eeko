import { GetFileOptions, Storage } from '@google-cloud/storage';

export class GoogleStorageService {
  storage: Storage;
  constructor() {
    this.storage = new Storage();
  }

  async listBucket(bucketName: string, options?: GetFileOptions) {
    console.log(`Loading contents from ${bucketName}`);
    const [files] = await this.storage.bucket(bucketName).getFiles(options);
    return files;
  }

  async readFile(bucketName: string, fileName: string) {
    const file = this.storage.bucket(bucketName).file(fileName);
    return await file.download();
  }

  async writeFile(bucketName: string, filePath: string, contents: any) {
    const file = this.storage.bucket(bucketName).file(filePath);
    try {
      await file.save(JSON.stringify(contents, null, 2));
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
