const objectScan = require('object-scan');

const align = (target, ref) => {
  const keysTarget = Object.keys(target);
  const keysRef = Object.keys(ref);
  keysTarget
    .map((k) => [k, keysRef.indexOf(k)])
    .map(([k, idx]) => (idx === -1 ? [k, Number.MAX_VALUE] : [k, idx]))
    .sort((e1, e2) => e1[1] - e2[1])
    .forEach(([k]) => {
      const value = target[k];
      // eslint-disable-next-line no-param-reassign
      delete target[k];
      // eslint-disable-next-line no-param-reassign
      target[k] = value;
    });
};

const scanner = objectScan(['', '**'], {
  breakFn: ({ property, context }) => {
    const last = context[context.length - 1];
    if (last instanceof Object) {
      context.push(property === undefined ? last : last[property]);
      return false;
    }
    context.push(null);
    return true;
  },
  filterFn: ({ value, context }) => {
    if (value instanceof Object) {
      const last = context[context.length - 1];
      if (last instanceof Object) {
        align(last, value);
      }
    }
    context.pop();
  }
});

module.exports = (tree, ref) => {
  scanner(ref, [tree]);
};
