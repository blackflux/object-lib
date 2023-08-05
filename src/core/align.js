import objectScan from 'object-scan';
import last from '../util/last.js';

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
    const ref = last(context);
    if (ref instanceof Object) {
      context.push(property === undefined ? ref : ref[property]);
      return false;
    }
    context.push(null);
    return true;
  },
  filterFn: ({ value, context }) => {
    const ref = context.pop();
    if (ref instanceof Object && value instanceof Object) {
      align(ref, value);
    }
  }
});

export default (tree, ref) => {
  scanner(ref, [tree]);
};
