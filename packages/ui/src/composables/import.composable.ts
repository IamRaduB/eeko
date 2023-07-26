import { ref } from 'vue';
import { buildNode } from '../utils/locale-node.factory';

export function useImportJson() {
  const importModal = ref(false);

  function toggleImportModal() {
    importModal.value = !importModal.value;
  }

  function importJson(content: any) {
    const tree = buildNode(null, content);
    toggleImportModal();

    return tree;
  }

  return {
    importModal,
    toggleImportModal,
    importJson,
  };
}
