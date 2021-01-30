const expect = require('chai').expect;
const { describe } = require('node-tdd');
const objectScan = require('object-scan');
const samplesize = require('lodash.samplesize');
const clone = require('../../src/core/clone');
const genData = require('./gen-data');

describe('Testing clone', { timeout: 100000 }, () => {
  it('Batch test (deep)', ({ fixture }) => {
    const compare = fixture('compare');
    const normalize = fixture('normalize');
    for (let x = 0; x < 5000; x += 1) {
      const data = genData();
      const cloned = clone(data);
      expect(data).to.deep.equal(cloned);
      expect(compare(data, cloned)).to.deep.equal(normalize(data));
    }
  });

  it('Batch test (shallow)', ({ fixture }) => {
    const compare = fixture('compare');
    const normalize = fixture('normalize');
    for (let x = 0; x < 5000; x += 1) {
      const data = genData();
      const cloned = clone(data, ['**']);
      expect(data).to.deep.equal(cloned);
      expect(compare(data, cloned)).to.deep.equal(normalize(data, ['**']));
    }
  });

  it('Batch test (random shallow)', ({ fixture }) => {
    const compare = fixture('compare');
    const normalize = fixture('normalize');
    for (let x = 0; x < 5000; x += 1) {
      const data = genData();
      const allKeys = objectScan(['**'], { joined: true })(data);
      const selectedKeys = samplesize(allKeys, Math.floor(Math.random() * allKeys.length) + 1);
      const cloned = clone(data, selectedKeys);
      expect(data).to.deep.equal(cloned);
      expect(compare(data, cloned)).to.deep.equal(normalize(data, selectedKeys));
    }
  });

  it('Test simple', () => {
    const data = {
      a: 1,
      b: { x: 2, y: { /* complex object */ } },
      c: [{ /* complex object */ }, { z: 3 }]
    };
    const cloned = clone(data, ['b.y', 'c[0]']);
    expect(data).to.deep.equal(cloned);
    expect(data).to.not.equal(cloned);
    expect(data.b).to.not.equal(cloned.b);
    expect(data.y).to.equal(cloned.y);
    expect(data.c[0]).to.equal(cloned.c[0]);
    expect(data.c[1]).to.not.equal(cloned.c[1]);
  });

  it('Test shallow clone', () => {
    const data = { a: {} };
    const cloned = clone(data, ['**']);
    expect(data).to.deep.equal(cloned);
    expect(data).to.not.equal(cloned);
    expect(data.a).to.equal(cloned.a);
  });

  it('Test exclude', () => {
    const data = { a: {} };
    const cloned = clone(data, ['!a']);
    expect(cloned).to.deep.equal({});
  });
});
