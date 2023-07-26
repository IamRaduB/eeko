import { allKeysHaveValues, isEqual, listKeysInObject } from './object';

describe('Object utils', () => {
  describe('listKeysInObject', () => {
    it('should return the correct list of keys for a 1 level deep object', function () {
      const input = {
        a: 'value1',
        b: 2,
        c: true,
      };

      const res = listKeysInObject(input);
      expect(res).toEqual(['a', 'b', 'c']);
    });

    it('should return the correct list of keys for a n level deep object', function () {
      const input = {
        a: 'value1',
        b: {
          d: 'level 2',
          e: {
            f: 'level 3',
          },
        },
        c: true,
      };
      const res = listKeysInObject(input);
      expect(res).toEqual(['a', 'b', 'd', 'e', 'f', 'c']);
    });
  });

  describe('isEqual', () => {
    it('should return false if the arrays have different lengths', function () {
      const arr1 = [];
      const arr2 = ['1', '2', '3'];

      const res = isEqual(arr1, arr2);
      expect(res).toEqual(false);
    });

    it('should return true if the arrays are empty', function () {
      const arr1 = [];
      const arr2 = [];

      const res = isEqual(arr1, arr2);
      expect(res).toEqual(true);
    });

    it('should return false if the arrays are not equal', function () {
      const arr1 = ['1', '2', 'c'];
      const arr2 = ['1', 'a', '3'];
      const res = isEqual(arr1, arr2);
      expect(res).toEqual(false);
    });

    it('should return true if the arrays are equal', function () {
      const arr1 = ['1', '2', '3'];
      const arr2 = ['1', '2', '3'];
      const res = isEqual(arr1, arr2);
      expect(res).toEqual(true);
    });
  });

  describe('allKeysHaveValues', () => {
    it('should return false if a key is missing values', function () {
      let input = {
        a: '',
        b: {
          c: 'value',
        },
      };

      expect(allKeysHaveValues(input)).toEqual(false);

      input = {
        a: 'value',
        b: {
          c: '',
        },
      };

      expect(allKeysHaveValues(input)).toEqual(false);
    });
    it('should return true if all keys have values', function () {
      const input = {
        a: 'value',
        b: {
          c: 'value',
        },
      };

      expect(allKeysHaveValues(input)).toEqual(true);
    });
  });
});
