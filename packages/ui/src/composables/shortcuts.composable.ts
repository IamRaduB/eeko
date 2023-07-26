import type { LocaleNode } from '../types/locale-node';
import { generateJson } from '../utils/json';
import { useProjectStore } from '../stores/project';
import { useRoute } from 'vue-router';

export function useShortcutActions() {
  const projectStore = useProjectStore();
  const route = useRoute();

  function downloadJson(list: LocaleNode[]) {
    const jsonContent = generateJson(list);
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:application/json;charset=utf-8,' +
        encodeURIComponent(JSON.stringify(jsonContent))
    );
    element.setAttribute('download', `${route.params.language}.json`);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  return {
    downloadJson,
  };
}
