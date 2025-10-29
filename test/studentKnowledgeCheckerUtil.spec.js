import { expect } from 'chai';
import { checkStudentKnowledge } from '../utils/studentKnowledgeCheckerUtil.js';

describe('utils/checkStudentKnowledge', () => {
  it('should return true when all answers are correct', () => {
    const student = { q1: 'A', q2: 'B', q3: 'C' };
    const correct = { q1: 'A', q2: 'B', q3: 'C' };
    expect(checkStudentKnowledge(student, correct)).to.be.true;
  });

  it('should return false when one answer is incorrect', () => {
    const student = { q1: 'A', q2: 'C', q3: 'C' };
    const correct = { q1: 'A', q2: 'B', q3: 'C' };
    expect(checkStudentKnowledge(student, correct)).to.be.false;
  });

  it('should return false when student has extra answers', () => {
    const student = { q1: 'A', q2: 'B', q3: 'C', q4: 'D' };
    const correct = { q1: 'A', q2: 'B', q3: 'C' };
    expect(checkStudentKnowledge(student, correct)).to.be.false;
  });

  it('should return false when student has fewer answers', () => {
    const student = { q1: 'A', q2: 'B' };
    const correct = { q1: 'A', q2: 'B', q3: 'C' };
    expect(checkStudentKnowledge(student, correct)).to.be.false;
  });

  it('should return false when keys are in different order', () => {
    const student = { q2: 'B', q1: 'A', q3: 'C' };
    const correct = { q1: 'A', q2: 'B', q3: 'C' };
    expect(checkStudentKnowledge(student, correct)).to.be.false;
  });

  it('should return false when both objects have same keys but different values', () => {
    const student = { q1: 'X', q2: 'Y' };
    const correct = { q1: 'A', q2: 'B' };
    expect(checkStudentKnowledge(student, correct)).to.be.false;
  });

  it('should handle numeric answers correctly', () => {
    const student = { q1: 1, q2: 2, q3: 3 };
    const correct = { q1: 1, q2: 2, q3: 3 };
    expect(checkStudentKnowledge(student, correct)).to.be.true;
  });

  it('should return false when numeric values differ', () => {
    const student = { q1: 1, q2: 3 };
    const correct = { q1: 1, q2: 2 };
    expect(checkStudentKnowledge(student, correct)).to.be.false;
  });

  it('should return true for empty objects (no questions)', () => {
    expect(checkStudentKnowledge({}, {})).to.be.true;
  });
});
