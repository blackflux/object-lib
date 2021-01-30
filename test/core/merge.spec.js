const expect = require('chai').expect;
const { describe } = require('node-tdd');
const cloneDeep = require('lodash.clonedeep');
const Merge = require('../../src/core/merge');
const genData = require('./gen-data');

describe('Testing Merge', { timeout: 100000 }, () => {
  describe('Default Merge', () => {
    let merge;
    before(() => {
      merge = Merge();
    });

    it('Batch test', ({ fixture }) => {
      const mergeRec = fixture('merge-rec');
      for (let x = 0; x < 10000; x += 1) {
        const tree = genData();
        const subtree = genData();
        const treeX = cloneDeep(tree);
        const subtreeX = cloneDeep(subtree);
        const r1 = merge(tree, subtree);
        expect(treeX).to.deep.equal(tree);
        expect(subtreeX).to.deep.equal(subtree);
        const r2 = mergeRec(tree, subtree);
        expect(treeX).to.deep.equal(tree);
        expect(subtreeX).to.deep.equal(subtree);
        expect(r1).to.deep.equal(r2);
      }
    });

    it('Nested empty array concat', () => {
      expect(merge([[]], [[]])).to.deep.equal([[], []]);
    });

    it('Nested arrays in object concat', () => {
      expect(merge(
        { B: [{}, [2]] },
        { B: [1] }
      )).to.deep.equal({ B: [{}, [2], 1] });
    });

    it('Nested array concat objects', () => {
      expect(merge([{ A: [] }], [0])).to.deep.equal([{ A: [] }, 0]);
    });

    it('Nested array overwrite with object', () => {
      expect(merge({ B: [{}, {}] }, { B: {} })).to.deep.equal({ B: {} });
    });

    it('Nested nested array concat', () => {
      expect(merge({ B: [[2]] }, { B: [[2]] })).to.deep.equal({ B: [[2], [2]] });
    });

    it('Object overwrite array', () => {
      expect(merge([1], { a: 1 })).to.deep.equal({ a: 1 });
    });

    it('Array overwrite object', () => {
      expect(merge({ a: 1 }, [1])).to.deep.equal([1]);
    });

    it('Testing string merge', () => {
      const d1 = 'A';
      const d2 = 'B';
      expect(merge(d1, d2)).to.deep.equal('B');
    });

    it('Testing array concat', () => {
      const d1 = [{ a: 1 }];
      const d2 = [{ a: 2 }];
      expect(merge(d1, d2)).to.deep.equal([{ a: 1 }, { a: 2 }]);
    });
  });

  describe('Custom Merge', () => {
    it('Batch test', () => {
      const merge = Merge({ '**': 'A' });
      for (let x = 0; x < 10000; x += 1) {
        const tree = genData();
        const subtree = genData();
        const treeX = cloneDeep(tree);
        const subtreeX = cloneDeep(subtree);
        expect(() => merge(tree, subtree)).to.not.throw();
        expect(treeX).to.deep.equal(tree);
        expect(subtreeX).to.deep.equal(subtree);
      }
    });

    it('Testing SO question: https://stackoverflow.com/questions/65822248', ({ fixture }) => {
      const json1 = fixture('json1');
      const json2 = fixture('json2');
      const merge = Merge({
        '[*]': 'id',
        '[*].addresses[*]': 'type'
      });
      expect(merge(json1, json2)).to.deep.equal(fixture('result'));
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

    it('Testing incompatible', () => {
      const d1 = [{ a: 1 }];
      const d2 = [undefined];
      const d3 = ['A'];
      expect(Merge({ '[*]': 'a' })(d1, d2, d3)).to.deep.equal([{ a: 1 }, undefined]);
    });

    it('Testing overwrite', () => {
      const d1 = { a: [{ a: 1 }] };
      const d2 = { a: [{ a: 2 }] };
      const d3 = { a: null };
      expect(Merge({ '[*]': 'a' })(d1, d2, d3)).to.deep.equal({ a: null });
    });
  });
});
