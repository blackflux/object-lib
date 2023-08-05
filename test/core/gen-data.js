const rand = (values) => Math.floor(Math.random() * values);

const gen = (depth) => {
  const v = rand(3);
  if (v === 0 || depth >= 3) {
    return rand(2) === 0 ? rand(3) : undefined;
  }
  if (v === 1) {
    return Array.from({ length: rand(3) }, () => gen(depth + 1));
  }
  const r = {};
  const keys = ['A', 'B', 'C'].sort(() => Math.random() - 0.5);
  for (let idx = 0, len = gen(3) + 1; idx < len; idx += 1) {
    r[keys[idx]] = gen(depth + 1);
  }
  return r;
};

export default () => gen(0);
