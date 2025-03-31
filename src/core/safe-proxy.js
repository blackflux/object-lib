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
      const currentPath = path ? `${path}.${propStr}` : propStr;

      const found = prop in target;
      if (!found && ctx?.throw !== false) {
        throw new Error(`Property '${currentPath}' does not exist`);
      }

      let value = found ? Reflect.get(target, prop, receiver) : undefined;

      if (typeof ctx?.cb === 'function') {
        value = ctx.cb(currentPath, value, found);
      }

      // eslint-disable-next-line @blackflux/rules/prevent-typeof-object
      if (value !== null && typeof value === 'object') {
        return SafeProxy(value, ctx, currentPath);
      }

      return value;
    },
    ...(ctx?.hasAny === true ? { has() { return true; } } : {})
  });
};

export default (tgt, ctx) => SafeProxy(tgt, ctx);
