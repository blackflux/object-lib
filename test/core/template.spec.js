import { expect } from 'chai';
import { describe } from 'node-tdd';
import Template from '../../src/core/template.js';

describe('Testing Template', () => {
  it('Testing basic', async () => {
    const input = {
      a: 'b'
    };
    const template = Template(input);
    expect(template.variables()).to.deep.equal(['b']);
    expect(template.render({ b: 123 })).to.deep.equal({ a: 123 });
  });

  it('Testing template variable', async () => {
    const input = {
      a: 'X{{b}}Y'
    };
    const template = Template(input);
    expect(template.variables()).to.deep.equal(['b']);
    expect(template.render({ b: 123 })).to.deep.equal({ a: 'X123Y' });
  });

  it('Testing duplicate variable', async () => {
    const input = {
      a: 'X{{b}}Y',
      b: 'b'
    };
    const template = Template(input);
    expect(template.variables()).to.deep.equal(['b']);
    expect(template.render({ b: 123 }))
      .to.deep.equal({ a: 'X123Y', b: 123 });
  });
});
