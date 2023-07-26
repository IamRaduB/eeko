import { ref } from 'vue';
import type { Ref } from 'vue';
import { AlertTypes } from '../types/alert';
import { useAlertStore } from '../stores/alert';

export function useSearch(nodeList: Ref<HTMLElement | null>) {
  const alertStore = useAlertStore();
  const searchString = ref('');

  function search() {
    if (!searchString.value) {
      return;
    }

    const parts = searchString.value.split('.');

    let source: HTMLElement | null = nodeList.value!;
    let result: HTMLInputElement | null = null;

    if (!source) {
      return;
    }

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const nodes: HTMLCollection = source!.children;
      for (let j = 0; j < nodes.length; j++) {
        const current = nodes.item(j);
        if (!current) {
          continue;
        }
        const keyInput: HTMLInputElement | null =
          current.querySelector('.keyInput');
        if (keyInput && keyInput.value === part) {
          // found the last part in the query
          if (i === parts.length - 1) {
            result = keyInput;
            break;
          }

          // search deeper into the hierarchy
          source = current.querySelector('.hierarchy');
          break;
        }
      }
    }

    if (result === null) {
      alertStore.addAlert(AlertTypes.ERROR, 'Translation key not found');
    } else {
      result.focus();
      result.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }

  return {
    searchString,
    search,
  };
}
