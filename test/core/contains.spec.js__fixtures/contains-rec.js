const containsRec = (haystack, needle) => {
  const needleType = typeof needle;
  const haystackType = typeof haystack;
  if (needleType !== haystackType) {
    return false;
  }
  if (needleType === 'object') {
    const needleIsArray = Array.isArray(needle);
    const haystackIsArray = Array.isArray(haystack);
    if (needleIsArray !== haystackIsArray) {
      return false;
    }
    // exact match for arrays
    if (needleIsArray) {
      if (needle.length !== haystack.length) {
        return false;
      }
      return needle.every((e, idx) => containsRec(haystack[idx], e));
    }
    // subset match for object
    return Object.keys(needle).every((key) => key in haystack && containsRec(haystack[key], needle[key]));
  }
  // default comparison
  return haystack === needle;
};

export default containsRec;
