import { expect } from 'chai';
import * as index from '../src/index.js';

describe('Testing index.js', () => {
  it('Testing exported', () => {
    expect(Object.keys(index)).to.deep.equal([
      'Merge',
      'SafeProxy',
      'Template',
      'align',
      'clone',
      'contains',
      'jsonSmartParse'
    ]);
  });
});
