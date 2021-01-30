const objectScan = require('object-scan');
const last = require('../util/last');
const mkChild = require('../util/mk-child');

module.exports = (obj, needles = []) => {
  const hasDoubleStar = needles.includes('**');
  const excludeLength = hasDoubleStar ? 0 : 1;
  return objectScan(
    hasDoubleStar ? needles : ['**', ...needles],
    {
      reverse: false,
      breakFn: ({
        isMatch, property, value, context, matchedBy
      }) => {
        if (!isMatch) {
          return false;
        }
        const ref = last(context);
        const excluded = matchedBy.length > excludeLength;
        ref[property] = excluded ? value : mkChild(value);
        context.push(ref[property]);
        return excluded;
      },
      filterFn: ({ context }) => {
        context.pop();
      }
    }
  )(obj, [mkChild(obj)]).pop();
};
