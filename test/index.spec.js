const expect = require('chai').expect;
const index = require('../src/index');

describe('Testing index.js', () => {
  it('Testing exported', () => {
    expect(Object.keys(index)).to.deep.equal([
      'align',
      'contains',
      'Merge'
    ]);
  });
});
