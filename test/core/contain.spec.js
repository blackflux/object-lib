const expect = require('chai').expect;
const contain = require('../../src/core/contain');

describe('Testing contain', () => {
  it('Testing String', () => {
    expect(contain('value1', 'value1')).to.equal(true);
    expect(contain('value1', 'value2')).to.equal(false);
  });

  it('Testing List', () => {
    expect(contain([1, 2, 3], [1, 2, 3])).to.equal(true);
    expect(contain([{ key: 'value1' }], [{ key: 'value1' }])).to.equal(true);
    expect(contain([{ key: 'value1' }], [{ key: 'value2' }])).to.equal(false);
    expect(contain([1, 2, 3], [3, 2, 1])).to.equal(false);
    expect(contain([1, 2, 3], [1, 2])).to.equal(false);
    expect(contain([], [])).to.equal(true);
  });

  it('Testing Object', () => {
    expect(contain({}, {})).to.equal(true);
    expect(contain({ key: 'value1' }, { key: 'value1' })).to.equal(true);
    expect(contain({ key: 'value1' }, { key: 'value2' })).to.equal(false);
  });

  it('Testing Type Mismatch', () => {
    expect(contain({}, '')).to.equal(false);
    expect(contain({}, [])).to.equal(false);
  });
});
