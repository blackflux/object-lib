import assert from 'assert';
import objectScan from 'object-scan';
import last from '../util/last.js';
import mkChild from '../util/mk-child.js';

const populate = (obj, key, fn) => {
  if (!(key in obj)) {
    // eslint-disable-next-line no-param-reassign
    obj[key] = fn();
    return true;
  }
  return false;
};
const incompatible = (a, b) => (
  !(a instanceof Object)
  || !(b instanceof Object)
  || Array.isArray(a) !== Array.isArray(b)
);

export default (logic_ = {}) => {
  const logic = { '**': null, ...logic_ };

  const scanner = objectScan(Object.keys(logic), {
    reverse: false,
    breakFn: ({
      isMatch, property, value, matchedBy, context
    }) => {
      const { stack, groups, path } = context;
      const ref = last(stack);

      if (!isMatch) {
        if (incompatible(ref, value)) {
          stack[0] = mkChild(value);
        }
        return false;
      }
      if (!(ref instanceof Object)) {
        stack.push(null);
        return true;
      }
      if (!Array.isArray(ref)) {
        if (!(property in ref) || incompatible(ref[property], value)) {
          ref[property] = mkChild(value);
        }
        stack.push(ref[property]);
        return false;
      }

      const bestNeedle = last(matchedBy);
      const groupBy = typeof logic[bestNeedle] === 'function'
        ? logic[bestNeedle](value)
        : logic[bestNeedle];

      if (groupBy === null) {
        ref.push(value);
        stack.push(null);
        return true;
      }

      const groupId = `${bestNeedle}.${groupBy}: ${path.join('.')}`;
      populate(groups, groupId, () => ({}));
      const groupEntryId = value instanceof Object ? value[groupBy] : undefined;
      if (populate(groups[groupId], groupEntryId, () => mkChild(value))) {
        ref.push(groups[groupId][groupEntryId]);
      }
      path.push(`${groupBy}=${groupEntryId}`);
      stack.push(groups[groupId][groupEntryId]);
      return false;
    },
    filterFn: ({ matchedBy, context }) => {
      const { stack, path } = context;
      stack.pop();
      if (logic[last(matchedBy)] !== null) {
        path.pop();
      }
    }
  });
  return (...args) => {
    const stack = [undefined];
    const groups = {};
    args.forEach((arg) => scanner(arg, { stack, groups, path: [] }));
    assert(stack.length === 1);
    return stack[0];
  };
};
