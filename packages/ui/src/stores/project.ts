import { defineStore } from 'pinia';
import type { LocaleNode } from '../types/locale-node';
import { generateJson } from '../utils/json';
import type { ProjectTranslation } from '../types/translation';
import { buildNode } from '../utils/locale-node.factory';
import { isFailedResponse } from '../utils/response.guard';

export interface ProjectState {
  files: ProjectTranslation[];
  template: LocaleNode | null;
  loading: boolean;
}

export const useProjectStore = defineStore({
  id: 'project',
  state: (): ProjectState => ({
    files: [],
    template: null,
    loading: true,
  }),
  getters: {
    filesExceptTemplate(state: ProjectState) {
      return state.files.filter((file) => file.fileName !== 'template');
    },
  },
  actions: {
    async listProjectFiles(): Promise<ProjectTranslation[]> {
      try {
        this.loading = true;
        const result = await this.$translationApi.listI18n();
        if (isFailedResponse(result)) {
          return [];
        }

        this.files = result;

        const template = this.files.find(
          (lang) => lang.fileName === 'template'
        );
        if (template) {
          await this.getTranslation(template.fileName, true);
        }

        return result;
      } finally {
        this.loading = false;
      }
    },

    async getTranslation(filePath: string, isTemplate?: boolean) {
      const result = await this.$translationApi.fetchI18n(filePath);
      if (isFailedResponse(result)) {
        return [];
      }

      if (isTemplate && Object.keys(result.content).length) {
        this.template = buildNode(null, result.content);
      }

      return result.content;
    },

    async createTranslationFile(fileName: string) {
      const result = await this.$translationApi.createI18n(fileName);
      if (isFailedResponse(result)) {
        return null;
      }

      this.files = [...this.files, result];
    },

    async updateTranslationFile(language: string, contents: LocaleNode[]) {
      const jsonPayload = generateJson(contents, language === 'template');
      const updatedFile = await this.$translationApi.updateI18n(
        language,
        jsonPayload
      );
      const index = this.files.findIndex(
        (lang) => lang.fullPath === updatedFile.fullPath
      );
      this.files.splice(index, 1, updatedFile);
      if (language === 'template') {
        this.files = this.files.map((translation) => ({
          ...translation,
          valid: false,
        }));
      }
    },
  },
});
