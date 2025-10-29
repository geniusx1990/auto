import { expect } from 'chai';
import { add, subtract, multiply, divide } from '../utils/mathUtils.js';

describe('utils/mathUtils', () => {
  describe('add', () => {
    it('should correctly add two positive numbers', () => {
      expect(add(5, 7)).to.equal(12);
    });

    it('should correctly add negative and positive numbers', () => {
      expect(add(-3, 9)).to.equal(6);
    });

    it('should return the same number when adding zero', () => {
      expect(add(10, 0)).to.equal(10);
    });

    it('should handle floating point numbers', () => {
      expect(add(0.1, 0.2)).to.be.closeTo(0.3, 0.0001);
    });
  });

  describe('subtract', () => {
    it('should correctly subtract smaller number from larger one', () => {
      expect(subtract(10, 4)).to.equal(6);
    });

    it('should return negative result when the second number is greater', () => {
      expect(subtract(4, 10)).to.equal(-6);
    });

    it('should handle negative numbers', () => {
      expect(subtract(-5, -3)).to.equal(-2);
    });

    it('should handle decimals', () => {
      expect(subtract(5.5, 2.2)).to.be.closeTo(3.3, 0.0001);
    });
  });

  describe('multiply', () => {
    it('should correctly multiply two positive numbers', () => {
      expect(multiply(3, 4)).to.equal(12);
    });

    it('should return zero if one operand is zero', () => {
      expect(multiply(0, 99)).to.equal(0);
    });

    it('should handle negative numbers', () => {
      expect(multiply(-2, 6)).to.equal(-12);
    });

    it('should handle two negative numbers', () => {
      expect(multiply(-3, -3)).to.equal(9);
    });

    it('should handle floating point numbers', () => {
      expect(multiply(1.5, 0.5)).to.be.closeTo(0.75, 0.0001);
    });
  });

  describe('divide', () => {
    it('should correctly divide two positive numbers', () => {
      expect(divide(20, 5)).to.equal(4);
    });

    it('should handle negative dividend', () => {
      expect(divide(-15, 3)).to.equal(-5);
    });

    it('should handle negative divisor', () => {
      expect(divide(12, -4)).to.equal(-3);
    });

    it('should handle two negative numbers', () => {
      expect(divide(-9, -3)).to.equal(3);
    });

    it('should handle floating point division', () => {
      expect(divide(1.5, 0.5)).to.be.closeTo(3.0, 0.0001);
    });

    it('should throw an error when dividing by zero', () => {
      expect(() => divide(10, 0)).to.throw('Cannot divide by zero');
    });
  });
});
