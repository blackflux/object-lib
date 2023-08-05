import { expect } from 'chai';
import { describe } from 'node-tdd';
import contains from '../../src/core/contains.js';
import genData from './gen-data.js';

describe('Testing contains', { timeout: 100000 }, () => {
  it('Batch test', async ({ fixture }) => {
    const containsRec = await fixture('contains-rec');
    for (let x = 0; x < 10000; x += 1) {
      const tree = genData();
      const subtree = genData();
      expect(contains(tree, subtree)).to.equal(containsRec(tree, subtree));
    }
  });

  describe('Testing String', () => {
    it('Testing equal', () => {
      expect(contains('value1', 'value1')).to.equal(true);
    });
    it('Testing not equal', () => {
      expect(contains('value1', 'value2')).to.equal(false);
    });
  });

  describe('Testing Array', () => {
    it('Testing equal arrays (containing three equal numbers)', () => {
      expect(contains([1, 2, 3], [1, 2, 3])).to.equal(true);
    });
    it('Testing not equal arrays (containing three equal numbers in different order)', () => {
      expect(contains([1, 2, 3], [3, 2, 1])).to.equal(false);
    });
    it('Testing equal arrays (containing single object)', () => {
      expect(contains([{ key: 'value1' }], [{ key: 'value1' }])).to.equal(true);
    });
    it('Testing not equal arrays (containing different single object)', () => {
      expect(contains([{ key: 'value1' }], [{ key: 'value2' }])).to.equal(false);
    });
    it('Testing not equal arrays (array contains number that are a subset)', () => {
      expect(contains([1, 2, 3], [1, 2])).to.equal(false);
    });
    it('Testing empty arrays equal', () => {
      expect(contains([], [])).to.equal(true);
    });
    it('Testing nested empty arrays equal', () => {
      expect(contains([[], []], [[], []])).to.equal(true);
    });
    it('Testing nested not equal (different arrays, removed)', () => {
      expect(contains([['x'], []], [[], []])).to.equal(false);
    });
    it('Testing nested not equal (different arrays, added)', () => {
      expect(contains([[], []], [['x'], []])).to.equal(false);
    });
  });

  describe('Testing Object', () => {
    it('Testing empty objects equal', () => {
      expect(contains({}, {})).to.equal(true);
    });
    it('Testing objects equal with single key', () => {
      expect(contains({ key: 'value1' }, { key: 'value1' })).to.equal(true);
    });
    it('Testing objects different with same keys, but different values', () => {
      expect(contains({ key: 'value1' }, { key: 'value2' })).to.equal(false);
    });
    it('Testing different keys (added)', () => {
      expect(contains({ key: 'value1' }, { key: 'value1', foo: 'bar' })).to.equal(false);
    });
    it('Testing different keys (removed)', () => {
      expect(contains({ key: 'value1', foo: 'bar' }, { key: 'value1' })).to.equal(true);
    });
  });

  describe('Testing Type Mismatch', () => {
    it('Testing empty object vs empty string', () => {
      expect(contains({}, '')).to.equal(false);
    });
    it('Testing empty object vs empty array', () => {
      expect(contains({}, [])).to.equal(false);
    });
    it('Testing empty array vs empty string', () => {
      expect(contains([], '')).to.equal(false);
    });
    it('Testing empty array vs empty object', () => {
      expect(contains([], {})).to.equal(false);
    });
    it('Testing empty string vs empty object', () => {
      expect(contains('', {})).to.equal(false);
    });
    it('Testing empty string vs empty array', () => {
      expect(contains('', [])).to.equal(false);
    });
  });
});
