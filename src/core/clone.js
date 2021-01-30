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
      if (property === undefined) {
        return false;
      }
      if (!isMatch) {
        return true;
      }
      const ref = last(context);
      const isBreak = matchedBy.length > breakLength;
      const v = isBreak ? value : mkChild(value);
      if (Array.isArray(ref)) {
        ref.push(v);
        context.push(last(ref));
      } else {
        ref[property] = v;
        context.push(ref[property]);
      }
      return isBreak;
    },
    filterFn: ({ context }) => {
      context.pop();
    }
  })(obj, [mkChild(obj)])[0];
};
