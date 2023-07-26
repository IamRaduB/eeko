import { ProjectTranslation } from './translation';

export interface StorageService {
  listStorage: (dirName: string) => Promise<ProjectTranslation[]>;

  readFile: (filePath: string, dirName: string) => Promise<unknown>;

  writeFile: (fileName: string, dirName: string, content?: string) => Promise<ProjectTranslation>;
}
