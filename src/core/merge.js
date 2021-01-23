const objectScan = require('object-scan');

module.exports = (logic_ = {}) => {
  const logic = { '**': null, ...logic_ };
  const last = (arr) => arr[arr.length - 1];
  const mkChild = (ref) => {
    if (!(ref instanceof Object)) {
      return ref;
    }
    return Array.isArray(ref) ? [] : {};
  };
  const populate = (obj, key, fn, force = false) => {
    if (force === true || !(key in obj)) {
      // eslint-disable-next-line no-param-reassign
      obj[key] = fn();
      return true;
    }
    return false;
  };

  const scanner = objectScan(Object.keys(logic), {
    reverse: false,
    breakFn: ({
      isMatch, property, value, matchedBy, context
    }) => {
      if (!isMatch) return;
      const { stack, groups, path } = context;
      const current = last(stack);
      const bestNeedle = last(matchedBy);
      const groupBy = typeof logic[bestNeedle] === 'function'
        ? logic[bestNeedle](value)
        : logic[bestNeedle];

      if (!Array.isArray(current) || groupBy === null) {
        if (Array.isArray(current)) {
          current.push(mkChild(value));
          stack.push(last(current));
        } else {
          populate(current, property, () => mkChild(value), !(value instanceof Object));
          stack.push(current[property]);
        }
      } else {
        const groupId = `${bestNeedle}.${groupBy}: ${path.join('.')}`;
        populate(groups, groupId, () => ({}));
        const groupEntryId = value[groupBy];
        if (populate(groups[groupId], groupEntryId, () => mkChild(value))) {
          current.push(groups[groupId][groupEntryId]);
        }
        path.push(`${groupBy}=${groupEntryId}`);
        stack.push(groups[groupId][groupEntryId]);
      }
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
    const result = mkChild(args[0]);
    const groups = {};
    args.forEach((arg) => scanner(arg, { stack: [result], groups, path: [] }));
    return result;
  };
};
