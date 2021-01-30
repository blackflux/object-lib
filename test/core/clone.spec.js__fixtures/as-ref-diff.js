const clonedeep = require('lodash.clonedeep');
const objectScan = require('object-scan');

module.exports = (obj_, needles = []) => {
  if (!(obj_ instanceof Object)) {
    return true;
  }
  const obj = clonedeep(obj_);
  const hasDoubleStar = needles.includes('**');
  const breakLength = hasDoubleStar ? 0 : 1;
  objectScan(hasDoubleStar ? needles : ['**', ...needles], {
    breakFn: ({
      isMatch, parent, property, isLeaf, matchedBy
    }) => {
      if (!isMatch) {
        return false;
      }
      if (matchedBy.length > breakLength || isLeaf) {
        // eslint-disable-next-line no-param-reassign
        parent[property] = true;
        return true;
      }
      return false;
    }
  })(obj);
  return obj;
};
