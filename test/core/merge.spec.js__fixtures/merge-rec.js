const mergeRec = (tree, subtree) => {
  if (!(subtree instanceof Object)) {
    return subtree;
  }
  const treeIsArray = Array.isArray(tree);
  const subtreeIsArray = Array.isArray(subtree);
  if (treeIsArray !== subtreeIsArray) {
    return subtreeIsArray ? [...subtree] : { ...subtree };
  }
  if (tree instanceof Object && subtree instanceof Object) {
    const e1 = Object.entries(tree);
    const e2 = Object.entries(subtree);
    const r = Array.isArray(subtree) ? [] : {};
    [e1, e2].forEach((e) => {
      e.forEach(([k, v]) => {
        if (Array.isArray(r)) {
          r.push(v);
        } else {
          r[k] = k in r ? mergeRec(r[k], v) : v;
        }
      });
    });
    return r;
  }
  return subtree;
};

export default mergeRec;
