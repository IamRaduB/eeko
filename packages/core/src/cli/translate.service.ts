import { ConfigService } from './config.service';
import { FileSystemService } from './fs.service';
import { ProjectTranslation } from '../types/translation';
import { allKeysHaveValues, isEqual, listKeysInObject } from '../util/object';

export class TranslateService {
  static areKeysInSync(templateContent: Record<string, any>, fileContent: null | Record<string, any>): boolean {
    if (templateContent && !fileContent) {
      return false;
    }

    const templateKeys = listKeysInObject(templateContent);
    const fileKeys = listKeysInObject(fileContent);
    return isEqual(templateKeys, fileKeys);
  }

  static isLangFileComplete(fileContents: null | Record<string, any>) {
    if (!fileContents) {
      return false;
    }

    return allKeysHaveValues(fileContents);
  }

  constructor(private storageService: FileSystemService, private configService: ConfigService) {}

  async getFilesForProject() {
    const files = await this.storageService.listStorage(this.configService.config.i18nLocation);
    const template = files.find((langFile) => langFile.fileName === 'template');
    if (!template) {
      return files;
    }

    const filesResult = await Promise.all(
      files
        .filter((langFile) => langFile.fileName !== 'template')
        .map(async (langFile) => ({
          ...langFile,
          valid: await this.validateTranslationFile(template, langFile),
        })),
    );
    return [...filesResult, template];
  }

  async validateTranslationFile(template: ProjectTranslation, file: ProjectTranslation) {
    const templateData = await this.loadFileContents(template.fileName);
    const fileData = await this.loadFileContents(file.fileName);
    return (
      TranslateService.areKeysInSync(templateData.content, fileData.content) &&
      TranslateService.isLangFileComplete(fileData.content)
    );
  }

  async loadFileContents(filePath: string) {
    return this.storageService.readFile(filePath, this.configService.config.i18nLocation);
  }

  async createTranslation(fileName: string) {
    return this.storageService.writeFile(fileName, this.configService.config.i18nLocation);
  }

  async updateTranslation(fileName: string, content: Record<string, any>) {
    const translation = await this.storageService.writeFile(fileName, this.configService.config.i18nLocation, content);
    return {
      ...translation,
      valid: TranslateService.isLangFileComplete(content),
    };
  }
}
