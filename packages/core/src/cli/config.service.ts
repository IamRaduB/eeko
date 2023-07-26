import { readFile } from 'fs/promises';
import { join } from 'path';
import { TranslatorConfig } from '../types/config';
import * as process from 'process';

const CONFIG_FILE_NAME = '.translatorrc.json';

export class ConfigService {
  private defaultConfig: TranslatorConfig;
  private _config: TranslatorConfig;
  basePath: string;

  constructor() {
    this.defaultConfig = {
      i18nLocation: './i18n',
      uiPort: 2016,
      devMode: false,
    };

    this._config = {
      ...this.defaultConfig,
    };
  }

  async readConfigFile() {
    try {
      const config = await readFile(join(process.cwd(), CONFIG_FILE_NAME), {
        encoding: 'utf8',
      });
      const configObject = JSON.parse(config) as TranslatorConfig;
      this._config = {
        ...this._config,
        ...configObject,
      };
      this.basePath = process.cwd();
    } catch (e) {
      console.warn('Could not locate ".translatorrc.json" file. Using default configuration.');
    }
  }

  get config() {
    return this._config;
  }
}

const configServiceInstance = new ConfigService();

export default configServiceInstance;
