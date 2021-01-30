const objectScan = require('object-scan');
const last = require('../util/last');
const mkChild = require('../util/mk-child');

module.exports = (obj, needles = []) => {
  const hasDoubleStar = needles.includes('**');
  const breakLength = hasDoubleStar ? 0 : 1;
  return objectScan(hasDoubleStar ? needles : ['**', ...needles], {
    reverse: false,
    breakFn: ({
      isMatch, property, value, context, matchedBy
    }) => {
      if (!isMatch) {
        return property !== undefined;
      }
      const ref = last(context);
      const doBreak = matchedBy.length > breakLength;
      const v = doBreak ? value : mkChild(value);
      if (Array.isArray(ref)) {
        ref.push(v);
        context.push(last(ref));
      } else {
        ref[property] = v;
        context.push(ref[property]);
      }
      return doBreak;
    },
    filterFn: ({ context }) => {
      context.pop();
    }
  })(obj, [mkChild(obj)])[0];
};
