import { expect } from 'chai';
import { findMax, findMin, removeDuplicates } from '../utils/arrayUtils.js';

describe('utils/arrayUtils', () => {
  describe('findMax', () => {
    it('should return the maximum number from a numeric array', () => {
      expect(findMax([4, 8, 1, 23, 7])).to.equal(23);
    });

    it('should handle arrays with negative and positive numbers', () => {
      expect(findMax([-15, -3, 0, 12, 5])).to.equal(12);
    });

    it('should return -Infinity for an empty array (Math.max default behavior)', () => {
      expect(findMax([])).to.equal(-Infinity);
    });

    it('should throw an error when input is not an array', () => {
      expect(() => findMax('not-an-array')).to.throw('Input must be an array');
    });
  });

  describe('findMin', () => {
    it('should return the minimum number from a numeric array', () => {
      expect(findMin([4, 8, 1, 23, 7])).to.equal(1);
    });

    it('should handle arrays with negative and positive numbers correctly', () => {
      expect(findMin([-20, -5, 3, 10])).to.equal(-20);
    });

    it('should return Infinity for an empty array (Math.min default behavior)', () => {
      expect(findMin([])).to.equal(Infinity);
    });

    it('should throw an error when input is not an array', () => {
      expect(() => findMin(123)).to.throw('Input must be an array');
    });
  });

  describe('removeDuplicates', () => {
    it('should remove duplicate numbers while preserving the original order', () => {
      expect(removeDuplicates([10, 20, 10, 30, 20, 40])).to.deep.equal([10, 20, 30, 40]);
    });

    it('should handle arrays with strings, numbers, and booleans', () => {
      expect(removeDuplicates(['x', 'y', 'x', 42, true, 42, false]))
        .to.deep.equal(['x', 'y', 42, true, false]);
    });

    it('should treat multiple NaN values as a single unique value', () => {
      const result = removeDuplicates([NaN, NaN, 'test']);
      expect(result.length).to.equal(2);
      expect(result[1]).to.equal('test');
    });

    it('should throw an error when input is not an array', () => {
      expect(() => removeDuplicates(undefined)).to.throw('Input must be an array');
    });
  });
});
