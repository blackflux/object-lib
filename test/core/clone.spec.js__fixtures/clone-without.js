import clonedeep from 'lodash.clonedeep';
import objectScan from 'object-scan';

export default (obj_, needles) => {
  if (!(obj_ instanceof Object)) {
    return obj_;
  }
  const obj = clonedeep(obj_);
  objectScan(needles, {
    breakFn: ({ isMatch, parent, property }) => {
      if (!isMatch) {
        return false;
      }
      if (Array.isArray(parent)) {
        parent.splice(property, 1);
      } else {
        // eslint-disable-next-line no-param-reassign
        delete parent[property];
      }
      return true;
    }
  })(obj);
  return obj;
};
