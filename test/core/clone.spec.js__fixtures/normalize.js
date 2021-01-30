const clonedeep = require('lodash.clonedeep');
const objectScan = require('object-scan');

module.exports = (obj_, needles = []) => {
  if (!(obj_ instanceof Object)) {
    return true;
  }
  const obj = clonedeep(obj_);
  objectScan(needles.map((n) => `!${n}`).concat('**'), {
    strict: false,
    breakFn: ({
      isMatch, parent, property, isLeaf, excludedBy
    }) => {
      if (!isMatch) {
        return false;
      }
      if (excludedBy.length !== 0 || isLeaf) {
        // eslint-disable-next-line no-param-reassign
        parent[property] = true;
        return true;
      }
      return false;
    }
  })(obj);
  return obj;
};
