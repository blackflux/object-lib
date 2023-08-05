const align = (target, ref) => {
  if (
    !(target instanceof Object)
    || !(ref instanceof Object)
  ) {
    return;
  }
  if (Array.isArray(target) !== Array.isArray(ref)) {
    return;
  }

  if (Array.isArray(target)) {
    for (let idx = 0, len = Math.min(target.length, ref.length); idx < len; idx += 1) {
      align(target[idx], ref[idx]);
    }
    return;
  }

  const keysTarget = Object.keys(target);
  const keysRef = Object.keys(ref);
  keysTarget
    .map((k) => [k, keysRef.indexOf(k)])
    .map(([k, idx]) => (idx === -1 ? [k, Number.MAX_VALUE] : [k, idx]))
    .sort(([k1, idx1], [k2, idx2]) => idx1 - idx2)
    .forEach(([k, idx]) => {
      const value = target[k];
      if (idx !== Number.MAX_VALUE) {
        align(value, ref[k]);
      }
      // eslint-disable-next-line no-param-reassign
      delete target[k];
      // eslint-disable-next-line no-param-reassign
      target[k] = value;
    });
};
export default align;
