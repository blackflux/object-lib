const expect = require('chai').expect;
const { describe } = require('node-tdd');
const Merge = require('../../src/core/merge');

describe('Testing Merge', () => {
  it('Testing SO question: https://stackoverflow.com/questions/65822248', ({ fixture }) => {
    const json1 = fixture('json1');
    const json2 = fixture('json2');
    const merge = Merge({
      '[*]': 'id',
      '[*].addresses[*]': 'type'
    });
    expect(merge(json1, json2)).to.deep.equal(fixture('result'));
  });

  it('Testing string merge', () => {
    const d1 = 'A';
    const d2 = 'B';
    expect(Merge()(d1, d2)).to.deep.equal('B');
  });

  it('Testing array concat', () => {
    const d1 = [{ a: 1 }];
    const d2 = [{ a: 2 }];
    expect(Merge()(d1, d2)).to.deep.equal([{ a: 1 }, { a: 2 }]);
  });

  it('Testing array merge', () => {
    const d1 = [{ a: 1, b: 1, c: 3 }];
    const d2 = [{ a: 1, b: 2, d: 4 }];
    expect(Merge({ '[*]': 'a' })(d1, d2)).to.deep.equal([{ ...d1[0], ...d2[0] }]);
  });

  it('Testing merge by sum', () => {
    const d1 = [[1, 2, 3], [2, 4], [1, 2]];
    const d2 = [[3, 3], [1, 5], [3, 2]];
    expect(Merge({
      '[*]': (o) => o.reduce((a, b) => a + b, 0)
    })(d1, d2)).to.deep.equal([
      [1, 2, 3, 2, 4, 3, 3, 1, 5],
      [1, 2],
      [3, 2]
    ]);
  });
});
