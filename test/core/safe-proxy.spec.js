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
