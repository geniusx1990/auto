import { expect } from 'chai';
import { capitalize, reverseString, isPalindrome } from '../utils/stringUtils.js';

describe('utils/stringUtils', () => {
  describe('capitalize', () => {
    it('should capitalize the first letter of a lowercase word', () => {
      expect(capitalize('hello')).to.equal('Hello');
    });

    it('should not change an already capitalized word', () => {
      expect(capitalize('World')).to.equal('World');
    });

    it('should work with single-letter strings', () => {
      expect(capitalize('a')).to.equal('A');
    });

    it('should leave an empty string unchanged', () => {
      expect(capitalize('')).to.equal('');
    });

    it('should throw an error if input is not a string', () => {
      expect(() => capitalize(123)).to.throw('Input must be a string');
    });
  });

  describe('reverseString', () => {
    it('should reverse a simple word', () => {
      expect(reverseString('hello')).to.equal('olleh');
    });

    it('should reverse strings containing spaces', () => {
      expect(reverseString('open ai')).to.equal('ia nepo');
    });

    it('should reverse strings with special characters', () => {
      expect(reverseString('!abc?')).to.equal('?cba!');
    });

    it('should return empty string when input is empty', () => {
      expect(reverseString('')).to.equal('');
    });

    it('should throw an error if input is not a string', () => {
      expect(() => reverseString(null)).to.throw('Input must be a string');
    });
  });

  describe('isPalindrome', () => {
    it('should return true for simple palindrome words', () => {
      expect(isPalindrome('madam')).to.be.true;
    });

    it('should return false for non-palindrome words', () => {
      expect(isPalindrome('chatgpt')).to.be.false;
    });

    it('should handle empty strings as palindrome (since reversed is same)', () => {
      expect(isPalindrome('')).to.be.true;
    });

    it('should be case-sensitive (e.g., "Racecar" is not same as "racecaR")', () => {
      expect(isPalindrome('Racecar')).to.be.false;
    });

    it('should throw an error if input is not a string', () => {
      expect(() => isPalindrome(42)).to.throw('Input must be a string');
    });
  });
});
