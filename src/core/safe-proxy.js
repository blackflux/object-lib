const BYPASS_PROPS = [
  Symbol.toStringTag,
  Symbol.toPrimitive,
  Symbol.iterator,
  Symbol.hasInstance,
  'inspect',
  'toString',
  'valueOf',
  'constructor',
  'then',
  'length'
];

// Proxy that errors when accessing non-existent properties
const SafeProxy = (tgt, ctx, path = '') => {
  // eslint-disable-next-line @blackflux/rules/prevent-typeof-object
  if (tgt === null || typeof tgt !== 'object') {
    return tgt;
  }

  return new Proxy(tgt, {
    get(target, prop, receiver) {
      if (BYPASS_PROPS.includes(prop) && !Object.prototype.hasOwnProperty.call(target, prop)) {
        return Reflect.get(target, prop, receiver);
      }

      const propStr = typeof prop === 'symbol' ? prop.toString() : String(prop);

      if (!(prop in target)) {
        const currentPath = path ? `${path}.${propStr}` : propStr;
        if (typeof ctx?.onNotFound === 'function') {
          return ctx.onNotFound(currentPath);
        }
        throw new Error(`Property '${currentPath}' does not exist`);
      }

      const value = Reflect.get(target, prop, receiver);

      // eslint-disable-next-line @blackflux/rules/prevent-typeof-object
      if (value !== null && typeof value === 'object') {
        const currentPath = path ? `${path}.${propStr}` : propStr;
        return SafeProxy(value, ctx, currentPath);
      }

      return value;
    }
  });
};

export default (tgt, ctx) => SafeProxy(tgt, ctx);
