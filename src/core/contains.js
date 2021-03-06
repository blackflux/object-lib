const objectScan = require('object-scan');
const last = require('../util/last');

const scanner = objectScan(['**'], {
  rtn: 'context',
  abort: true,
  breakFn: ({
    isLeaf, isMatch, property, value, context
  }) => {
    const { stack } = context;
    const ref = last(stack);
    if (isMatch && !(property in ref)) {
      context.result = false;
      return true;
    }
    const current = isMatch ? ref[property] : ref;
    if (isLeaf) {
      if (value !== current) {
        context.result = false;
        return true;
      }
    } else if (
      value instanceof Object !== current instanceof Object
      || Array.isArray(value) !== Array.isArray(current)
      || (Array.isArray(value) && value.length !== current.length)
    ) {
      context.result = false;
      return true;
    }
    stack.push(current);
    return false;
  },
  filterFn: ({ context }) => {
    context.stack.pop();
    return context.result !== true;
  }
});

module.exports = (tree, subtree) => {
  const { result } = scanner(subtree, { stack: [tree], result: true });
  return result;
};
