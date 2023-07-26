import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { StorageService } from '../types/storage-service';
import { ProjectTranslation } from '../types/translation';

export class FileSystemService implements StorageService {
  constructor(private basePath = process.cwd()) {}

  async listStorage(dirName: string) {
    const dirPath = join(this.basePath, dirName);
    const result = await readdir(dirPath);
    return result.map((entry): ProjectTranslation => {
      return {
        fileName: entry.substring(0, entry.lastIndexOf('.')),
        fileFullName: entry,
        fullPath: join(this.basePath, dirName, entry),
      };
    });
  }

  async readFile(locale: string, dirName: string): Promise<{ content: Record<string, any | null> }> {
    const filePath = join(this.basePath, dirName, `${locale}.json`);
    const fileContents = await readFile(filePath, { encoding: 'utf8' });
    if (!fileContents) {
      return {
        content: null,
      };
    }

    return {
      content: JSON.parse(fileContents),
    };
  }

  async writeFile(locale: string, dirName: string, content = {}): Promise<ProjectTranslation> {
    const filePath = join(this.basePath, dirName, `${locale}.json`);
    await writeFile(filePath, JSON.stringify(content, null, 2), {
      encoding: 'utf8',
    });
    return {
      fileName: locale,
      fileFullName: `${locale}.json`,
      fullPath: filePath,
    };
  }
}
