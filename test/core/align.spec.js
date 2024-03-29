import { expect } from 'chai';
import cloneDeep from 'lodash.clonedeep';
import { describe } from 'node-tdd';
import align from '../../src/core/align.js';
import genData from './gen-data.js';

describe('Testing align', { timeout: 100000 }, () => {
  const convert = (input) => {
    if (input === undefined) {
      return input;
    }
    return JSON.stringify(input, null, 2).split('\n');
  };
  const runTest = (input, template, expected) => {
    align(input, template);
    expect(convert(input)).to.deep.equal(convert(expected));
  };

  it('Batch test', async ({ fixture }) => {
    const alignRec = await fixture('align-rec');
    for (let x = 0; x < 10000; x += 1) {
      const tree1 = genData();
      const tree2 = cloneDeep(tree1);
      const ref = genData();
      align(tree1, ref);
      alignRec(tree2, ref);
      expect(convert(tree1)).to.deep.equal(convert(tree2));
    }
  });

  it('Testing Basic Ordering', () => {
    const obj = { key1: 'value1', key2: 'value2' };
    const ref = { key2: 'value2', key1: 'value1' };
    const expected = { key2: 'value2', key1: 'value1' };
    runTest(obj, ref, expected);
  });

  it('Testing Recursive Ordering (Object)', () => {
    const obj = { key: { key1: 'value1', key2: 'value2' } };
    const ref = { key: { key2: 'value2', key1: 'value1' } };
    const expected = { key: { key2: 'value2', key1: 'value1' } };
    runTest(obj, ref, expected);
  });

  it('Testing Recursive Ordering (Array)', () => {
    const obj = { key: [{ key1: 'value1', key2: 'value2' }], misc: [] };
    const ref = { key: [{ key2: 'value2', key1: 'value1' }], misc: {} };
    const expected = { key: [{ key2: 'value2', key1: 'value1' }], misc: [] };
    runTest(obj, ref, expected);
  });

  it('Testing Additional Entry Appends', () => {
    const obj = { key3: 'value3', key2: 'value2', key1: 'value1' };
    const ref = { key1: 'value1' };
    const expected = { key1: 'value1', key3: 'value3', key2: 'value2' };
    runTest(obj, ref, expected);
  });

  it('Testing Readme Example', () => {
    const obj = { k1: 1, k2: 2 };
    const ref = { k2: null, k1: null };
    const expected = { k2: 2, k1: 1 };
    runTest(obj, ref, expected);
  });
});
