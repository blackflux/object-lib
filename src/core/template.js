import objectScan from 'object-scan';

const regex = /\{\{[^}]+}}/g;
const scanner = objectScan(['**'], {
  joined: true,
  filterFn: ({
    isLeaf, parent, property, value, context: callback
  }) => {
    if (isLeaf) {
      if (regex.test(value)) {
        // eslint-disable-next-line no-param-reassign
        parent[property] = value.replaceAll(regex, (m) => {
          const replacement = callback(m.slice(2, -2));
          return replacement === undefined ? m : replacement;
        });
      } else {
        const replacement = callback(value);
        if (replacement !== undefined) {
          // eslint-disable-next-line no-param-reassign
          parent[property] = replacement;
        }
      }
    }
  }
});

export default (template) => ({
  variables: () => {
    const result = new Set();
    scanner(template, (v) => {
      result.add(v);
    });
    return [...result];
  },
  render: (data) => {
    const result = structuredClone(template);
    scanner(result, (v) => data[v]);
    return result;
  }
});
