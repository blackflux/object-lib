const objectScan = require('object-scan');
const last = require('../util/last');
const mkChild = require('../util/mk-child');

module.exports = (obj, needles = []) => objectScan(needles.map((n) => `!${n}`).concat('**'), {
  strict: false,
  reverse: false,
  breakFn: ({
    isMatch, property, value, context, excludedBy
  }) => {
    if (!isMatch) {
      return false;
    }
    const ref = last(context);
    const excluded = excludedBy.length !== 0;
    ref[property] = excluded ? value : mkChild(value);
    context.push(ref[property]);
    return excluded;
  },
  filterFn: ({ context }) => {
    context.pop();
  }
})(obj, [mkChild(obj)]).pop();
