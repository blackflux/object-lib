const subs = { // table of character substitutions
  '\n': '\\n',
  '\r': '\\r',
  '\t': '\\t'
};

export default (str) => {
  let result = str;
  if (result.includes('```')) {
    result = result.split(/```(?:json)?/)[1];
  }

  result = result.split('');
  let escaped = false;
  let quoted = false;
  for (let i = 0; i < result.length; i += 1) {
    const char = result[i];
    if (quoted && char in subs) {
      result[i] = subs[char];
    }
    if (!escaped && char === '"') {
      quoted = !quoted;
    }
    escaped = char === '\\' ? !escaped : false;
  }
  result = result.join('');

  return JSON.parse(result);
};
