import type { Api } from './api';
import type {
  LocaleContentDto,
  ProjectTranslation,
} from '../types/translation';
import type { FailedResponse } from '../types/response';

export class TranslationApi {
  constructor(private client: Api) {}

  async fetchI18n(locale: string): Promise<LocaleContentDto | FailedResponse> {
    const result = await this.client.get('i18n', {
      params: {
        locale,
      },
    });
    return result.data;
  }

  async createI18n(localeName: string) {
    const result = await this.client.post(
      'i18n',
      {},
      {
        params: {
          locale: localeName,
        },
      }
    );
    return result.data;
  }

  async updateI18n(
    localeName: string,
    payload: any
  ): Promise<ProjectTranslation> {
    const result = await this.client.put('i18n', payload, {
      params: {
        locale: localeName,
      },
    });
    return result.data;
  }

  async listI18n() {
    const result = await this.client.get('/list-i18n');
    return result.data;
  }
}
