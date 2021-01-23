const expect = require('chai').expect;
const contains = require('../../src/core/contains');

describe('Testing contains', () => {
  it('Testing String', () => {
    expect(contains('value1', 'value1')).to.equal(true);
    expect(contains('value1', 'value2')).to.equal(false);
  });

  it('Testing List', () => {
    expect(contains([1, 2, 3], [1, 2, 3])).to.equal(true);
    expect(contains([{ key: 'value1' }], [{ key: 'value1' }])).to.equal(true);
    expect(contains([{ key: 'value1' }], [{ key: 'value2' }])).to.equal(false);
    expect(contains([1, 2, 3], [3, 2, 1])).to.equal(false);
    expect(contains([1, 2, 3], [1, 2])).to.equal(false);
    expect(contains([], [])).to.equal(true);
  });

  it('Testing Object', () => {
    expect(contains({}, {})).to.equal(true);
    expect(contains({ key: 'value1' }, { key: 'value1' })).to.equal(true);
    expect(contains({ key: 'value1' }, { key: 'value2' })).to.equal(false);
  });

  it('Testing Type Mismatch', () => {
    expect(contains({}, '')).to.equal(false);
    expect(contains({}, [])).to.equal(false);
  });
});
