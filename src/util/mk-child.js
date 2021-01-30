module.exports = (ref) => {
  if (!(ref instanceof Object)) {
    return ref;
  }
  return Array.isArray(ref) ? [] : {};
};
