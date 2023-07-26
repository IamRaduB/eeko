export function listKeysInObject(input: Record<string, any>) {
  const rootKeys = Object.keys(input);
  const keyList = [];
  rootKeys.forEach((key) => {
    keyList.push(key);
    if (typeof input[key] === 'object') {
      keyList.push(...listKeysInObject(input[key]));
    }
  });
  return keyList;
}

export function isEqual(arr1: string[], arr2: string[]) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  let equal = true;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      equal = false;
      break;
    }
  }

  return equal;
}

export function allKeysHaveValues(input: Record<string, any>): boolean {
  return Object.keys(input).every((key) => {
    if (typeof input[key] === 'object') {
      return allKeysHaveValues(input[key]);
    }

    return input[key] !== '';
  });
}
