const objectScan = require('object-scan');

const last = (arr) => arr[arr.length - 1];
const mkChild = (ref) => {
  if (!(ref instanceof Object)) {
    return ref;
  }
  return Array.isArray(ref) ? [] : {};
};
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

module.exports = (logic_ = {}) => {
  const logic = { '**': null, ...logic_ };

  const scanner = objectScan(Object.keys(logic), {
    reverse: false,
    breakFn: ({
      isMatch, parent, property, value, matchedBy, context
    }) => {
      const { stack, groups, path } = context;
      const current = last(stack);

      if (!isMatch) {
        if (incompatible(current, value)) {
          stack[0] = mkChild(value);
        }
        return false;
      }

      const bestNeedle = last(matchedBy);
      const groupBy = typeof logic[bestNeedle] === 'function'
        ? logic[bestNeedle](value)
        : logic[bestNeedle];

      if (!Array.isArray(current) || groupBy === null) {
        if (!(current instanceof Object)) {
          stack.push(null);
          return true;
        }
        if (Array.isArray(current) && Array.isArray(parent)) {
          current.push(value);
          stack.push(null);
          return true;
        }
        if (property in current && incompatible(current[property], value)) {
          current[property] = value;
          stack.push(null);
          return true;
        }
        populate(current, property, () => mkChild(value));
        stack.push(current[property]);
        return false;
      }

      const groupId = `${bestNeedle}.${groupBy}: ${path.join('.')}`;
      populate(groups, groupId, () => ({}));
      const groupEntryId = value instanceof Object ? value[groupBy] : undefined;
      if (populate(groups[groupId], groupEntryId, () => mkChild(value))) {
        current.push(groups[groupId][groupEntryId]);
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
    return stack[0];
  };
};
