import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { StorageService } from '../types/storage-service';
import { ProjectTranslation } from '../types/translation';

export class FileSystemService implements StorageService {
  constructor(private basePath = process.cwd()) {}

  async listStorage(dirName: string) {
    const dirPath = join(this.basePath, dirName);
    try {
      const result = await readdir(dirPath);
      return result.map((entry): ProjectTranslation => {
        return {
          fileName: entry.substring(0, entry.lastIndexOf('.')),
          fileFullName: entry,
          fullPath: join(this.basePath, dirName, entry),
        };
      });
    } catch (e) {
      console.warn(
        'I18n directory {',
        dirName,
        '} was not found. Rerun "eeko init" or update ".eekorc.json" file with the correct i18nLocation'
      );
      console.debug(e);
      return [];
    }
  }

  async readFile(
    locale: string,
    dirName: string
  ): Promise<{ content: Record<string, any | null> }> {
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

  async writeFile(
    fileName: string,
    dirName: string,
    content = {}
  ): Promise<ProjectTranslation> {
    const filePath = join(this.basePath, dirName, `${fileName}.json`);
    await writeFile(filePath, JSON.stringify(content, null, 2), {
      encoding: 'utf8',
    });
    return {
      fileName,
      fileFullName: `${fileName}.json`,
      fullPath: filePath,
    };
  }
}
