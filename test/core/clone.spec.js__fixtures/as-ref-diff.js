import clonedeep from 'lodash.clonedeep';
import objectScan from 'object-scan';

export default (obj_, needles = []) => {
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
