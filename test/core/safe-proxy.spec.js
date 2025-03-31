import { expect } from 'chai';
import { describe } from 'node-tdd';
import SafeProxy from '../../src/core/safe-proxy.js';

describe('Testing SafeProxy', () => {
  it('Testing primitive', async () => {
    const str = 'some-string';
    const proxy = SafeProxy(str);
    expect(proxy).to.equal('some-string');
  });

  it('Testing build-in functions', async () => {
    const obj = {
      length: {
        hello: 123
      }
    };
    const proxy = SafeProxy(obj);
    expect(proxy.length.hello).to.equal(123);
    expect(proxy.toString()).to.equal('[object Object]');
  });

  it('Basic throw', async ({ capture }) => {
    const obj = {};
    const proxy = SafeProxy(obj);
    const err = await capture(() => proxy.undefined);
    expect(err.message).to.deep.equal('Property \'undefined\' does not exist');
  });

  it('Basic not-found overwrite', async () => {
    const obj = { a: { b: {} } };
    const proxy = SafeProxy(obj, {
      cb: ({ key, value }) => (['', undefined].includes(value) ? `Not Specified <${key}>` : value)
    });
    const resp = proxy.a.b.c;
    expect(resp).to.deep.equal('Not Specified <a.b.c>');
  });

  it('Specific key overwrite', async () => {
    const obj = { a: { b: {} } };
    const cb = ({ key, value }) => (key === 'a.b' ? '<overwritten>' : value);
    const proxy = SafeProxy(obj, { cb });
    const resp = proxy.a.b;
    expect(resp).to.deep.equal('<overwritten>');
  });

  it('Not found chaining', async () => {
    const obj = { a: { b: {} } };
    const proxy = SafeProxy(obj, {
      cb: ({ key, value, found }) => (found ? value : { key })
    });
    const resp = proxy.a.b.c.d.e;
    expect(resp).to.deep.equal({ key: 'a.b.c.d.e' });
  });

  it('Testing hasAny', async () => {
    const obj = { a: {} };
    const proxyHasAll = SafeProxy(obj, { cb: ({ value: v }) => v });
    const proxyHasSome = SafeProxy(obj);
    expect('a' in proxyHasAll).to.deep.equal(true);
    expect(proxyHasAll.a).to.deep.equal({});
    expect('b' in proxyHasAll).to.deep.equal(true);
    expect('a' in proxyHasSome).to.deep.equal(true);
    expect('b' in proxyHasSome).to.deep.equal(false);
  });

  it('Basic symbol error', async ({ capture }) => {
    const symbol = Symbol('key');
    const obj = {
      data: {
        [symbol]: {}
      }
    };
    const proxy = SafeProxy(obj);
    const err = await capture(() => proxy.data[symbol].undefined);
    expect(err.message).to.deep.equal('Property \'data.Symbol(key).undefined\' does not exist');
  });
});
