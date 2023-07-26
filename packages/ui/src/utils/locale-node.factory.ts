import { v4 as uuidv4 } from 'uuid';
import type { LocaleNode } from '../types/locale-node';
import { reactive } from 'vue';

/**
 *
 * {
 *   id: 'abc',
 *   nodeKey: 'first',
 *   nodeValue: [
 *     {
 *       id: 'def',
 *       nodeKey: 'first-inner',
 *       nodeValue: 'first-inner-value'
 *     },
 *     {
 *       id: 'ghi',
 *       nodeKey: 'second-inner',
 *       nodeValue: 'second-inner-value'
 *     },
 *   ]
 * }
 *
 */

export function buildNode(key: string | null, value: string | any): LocaleNode {
  if (typeof value === 'string') {
    return reactive({
      id: uuidv4(),
      nodeKey: key,
      nodeValue: value,
    });
  }

  return reactive({
    id: uuidv4(),
    nodeKey: key,
    nodeValue: Object.keys(value).map((innerKey: string) => {
      return buildNode(innerKey, value[innerKey]);
    }),
  });
}
