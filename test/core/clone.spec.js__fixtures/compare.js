const compare = (o1, o2) => {
  if (o1 === o2) {
    return true;
  }
  if (Array.isArray(o1)) {
    return Object.entries(o1)
      .map(([k, v]) => compare(v, o2[k]));
  }
  return Object.entries(o1)
    .reduce((prev, [k, v]) => {
      // eslint-disable-next-line no-param-reassign
      prev[k] = compare(v, o2[k]);
      return prev;
    }, {});
};

module.exports = compare;
