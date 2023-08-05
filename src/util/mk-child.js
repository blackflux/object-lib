export default (ref) => {
  if (!(ref instanceof Object)) {
    return ref;
  }
  return Array.isArray(ref) ? [] : {};
};
