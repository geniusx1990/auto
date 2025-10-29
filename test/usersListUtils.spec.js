import { expect } from 'chai';
import {
  filterUsersByAge,
  sortUsersByName,
  findUserById,
  isEmailTaken,
} from '../utils/usersListUtils.js';

const sampleUsers = [
  { id: 1, name: 'Zoe', age: 28, email: 'zoe@example.com' },
  { id: 2, name: 'adam', age: 19, email: 'adam@example.com' },
  { id: 3, name: 'Mia', age: 35, email: 'mia@example.com' },
  { id: 4, name: 'Bob', age: 22, email: 'bob@example.com' },
  { id: 5, name: 'Eve', age: 30, email: 'eve@example.com' },
];

describe('utils/userUtils', () => {
  describe('filterUsersByAge', () => {
    it('should include users within inclusive min/max bounds', () => {
      const result = filterUsersByAge(sampleUsers, 22, 30);
      expect(result.map(u => u.id)).to.include.members([1, 4, 5]).and.to.have.length(3);
    });

    it('should return empty array if nobody matches', () => {
      const result = filterUsersByAge(sampleUsers, 60, 70);
      expect(result).to.deep.equal([]);
    });

    it('should exclude users without an age property (undefined comparison is false)', () => {
      const users = [...sampleUsers, { id: 99, name: 'NoAge', email: 'na@example.com' }];
      const result = filterUsersByAge(users, 18, 40);
      expect(result.some(u => u.id === 99)).to.be.false;
    });

    it('should throw if users is not an array', () => {
      expect(() => filterUsersByAge(null, 18, 30)).to.throw('Users must be an array');
    });
  });

  describe('sortUsersByName', () => {
    it('should sort users alphabetically by name using localeCompare', () => {
      const result = sortUsersByName(sampleUsers);
      expect(result.map(u => u.name)).to.deep.equal(['adam', 'Bob', 'Eve', 'Mia', 'Zoe']);
    });

    it('should not mutate the original array', () => {
      const original = [...sampleUsers];
      const result = sortUsersByName(sampleUsers);
      expect(result).to.not.equal(sampleUsers);
      expect(sampleUsers).to.deep.equal(original);
    });

    it('should throw if users is not an array', () => {
      expect(() => sortUsersByName({})).to.throw('Users must be an array');
    });
  });

  describe('findUserById', () => {
    it('should return the user object when id exists', () => {
      const found = findUserById(sampleUsers, 4);
      expect(found).to.deep.include({ id: 4, name: 'Bob' });
    });

    it('should return null when id does not exist', () => {
      expect(findUserById(sampleUsers, 999)).to.equal(null);
    });

    it('should use strict equality for id (number !== string)', () => {
      expect(findUserById(sampleUsers, '4')).to.equal(null);
    });

    it('should throw if users is not an array', () => {
      expect(() => findUserById('not-an-array', 1)).to.throw('Users must be an array');
    });
  });

  describe('isEmailTaken', () => {
    it('should return true if the email exists', () => {
      expect(isEmailTaken(sampleUsers, 'mia@example.com')).to.be.true;
    });

    it('should return false if the email does not exist', () => {
      expect(isEmailTaken(sampleUsers, 'nope@example.com')).to.be.false;
    });

    it('should be case-sensitive (strict equality)', () => {
      expect(isEmailTaken(sampleUsers, 'MIA@example.com')).to.be.false;
    });

    it('should throw if users is not an array', () => {
      expect(() => isEmailTaken(undefined, 'x@y.z')).to.throw('Users must be an array');
    });
  });
});
