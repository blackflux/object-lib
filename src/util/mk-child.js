export default (ref) => {
  if (!(ref instanceof Object)) {
    return ref;
  }
  const result = Array.isArray(ref) ? [] : {};
  const symbols = Object.getOwnPropertySymbols(ref);
  for (let i = 0; i < symbols.length; i += 1) {
    const symbol = symbols[i];
    const descriptor = Object.getOwnPropertyDescriptor(ref, symbol);
    Object.defineProperty(result, symbol, descriptor);
  }
  return result;
};
