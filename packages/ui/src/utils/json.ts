import type { LocaleNode } from '../types/locale-node';

export function generateJson(contents: LocaleNode[], noValue = false): any {
  const res = {};
  return contents.reduce((prev, current) => {
    if (typeof current.nodeValue === 'string') {
      return {
        ...prev,
        [current.nodeKey!]: noValue ? '' : current.nodeValue,
      };
    }

    return {
      ...prev,
      [current.nodeKey!]: {
        ...generateJson(current.nodeValue, noValue),
      },
    };
  }, {});
}
