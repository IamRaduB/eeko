import { ref } from 'vue';
import type { LocaleNode } from '../types/locale-node';

export function useDeleteNode() {
  const deleteModal = ref(false);
  const nodeToDelete = ref<LocaleNode | null>(null);

  function closeDeleteNodeModal() {
    deleteModal.value = false;
    nodeToDelete.value = null;
  }

  function openDeleteNodeModal(node: string | LocaleNode) {
    if (typeof node === 'string') {
      return;
    }
    deleteModal.value = true;
    nodeToDelete.value = node;
  }

  function deleteNode(nodeList: LocaleNode[]) {
    if (!nodeToDelete.value) {
      console.warn('Node to delete is not set!');
      return nodeList;
    }

    // delete filters out one level only, to avoid long lookups in deeply nested translation trees
    const filteredList = nodeList.filter((existingNode: LocaleNode) => {
      return existingNode.id !== nodeToDelete.value!.id;
    });

    closeDeleteNodeModal();

    return filteredList;
  }

  return {
    deleteModal,
    nodeToDelete,
    openDeleteNodeModal,
    closeDeleteNodeModal,
    deleteNode,
  };
}
