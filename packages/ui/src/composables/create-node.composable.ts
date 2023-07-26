import type { LocaleNode } from '../types/locale-node';
import { buildNode } from '../utils/locale-node.factory';
import { ref } from 'vue';

export function useCreateNode() {
  const nodeList = ref<HTMLUListElement | null>(null);

  function insertNodeInList(index: number, list: LocaleNode[]) {
    // insert a new node in the root array
    const newNode = buildNode('label', '');
    return [...list.slice(0, index + 1), newNode, ...list.slice(index + 1)];
  }

  function focusNode(nodeId: string) {
    const nodeToFocus: HTMLInputElement | null = nodeList.value!.querySelector(
      `[id='${nodeId}']`
    );
    if (nodeToFocus) {
      nodeToFocus.focus();
    }
  }

  return {
    nodeList,
    insertNodeInList,
  };
}
