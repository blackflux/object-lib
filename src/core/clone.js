import objectScan from 'object-scan';
import last from '../util/last.js';
import mkChild from '../util/mk-child.js';

export default (obj, needles = []) => {
  const hasDoubleStar = needles.includes('**');
  const breakLength = hasDoubleStar ? 0 : 1;
  return objectScan(hasDoubleStar ? needles : ['**', ...needles], {
    reverse: false,
    breakFn: ({
      isMatch, property, value, context, getMatchedBy
    }) => {
      if (!isMatch) {
        return property !== undefined;
      }
      const ref = last(context);
      const doBreak = getMatchedBy().length > breakLength;
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
