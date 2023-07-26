import type { LocaleNode } from '../types/locale-node';
import { ref } from 'vue';
import { buildNode } from '../utils/locale-node.factory';

export function useConvertNode() {
  const convertModal = ref(false);
  const nodeToConvert = ref<LocaleNode | null>(null);

  function closeConvertNodeModal() {
    convertModal.value = false;
    nodeToConvert.value = null;
  }

  function openConvertNodeModal(node: string | LocaleNode) {
    if (typeof node === 'string') {
      return;
    }
    convertModal.value = true;
    nodeToConvert.value = node;
  }

  function convertNodeToSimple() {
    nodeToConvert.value!.nodeValue = '';

    closeConvertNodeModal();
  }

  function buildNestedNodeValue() {
    return [buildNode('label', '')];
  }

  return {
    convertModal,
    nodeToConvert,
    closeConvertNodeModal,
    openConvertNodeModal,
    convertNodeToSimple,
    buildNestedNodeValue,
  };
}
