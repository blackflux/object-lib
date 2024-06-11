export default (str) => {
  let result = str;
  if (result.includes('```')) {
    result = result.split(/```(?:json)?/)[1];
  }

  const unescaped = [];
  let escaped = false;
  let quoted = false;
  for (let i = 0; i < result.length; i += 1) {
    const char = result[i];
    if (['\n', '\r', '\t'].includes(char) && quoted) {
      unescaped.push(i);
    }
    if (!escaped && char === '"') {
      quoted = !quoted;
    }
    escaped = char === '\\' ? !escaped : false;
  }

  result = result.replace(/\n/g, (m, idx) => {
    if (unescaped.includes(idx)) {
      return JSON.stringify(m).slice(1, -1);
    }
    return m;
  });

  return JSON.parse(result);
};
