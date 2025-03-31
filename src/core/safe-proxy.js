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
const SafeProxy = (tgt, ctx, key = '') => {
  // eslint-disable-next-line @blackflux/rules/prevent-typeof-object
  if (tgt === null || typeof tgt !== 'object') {
    return tgt;
  }

  const hasCb = typeof ctx?.cb === 'function';

  return new Proxy(tgt, {
    get(target, prop, receiver) {
      if (BYPASS_PROPS.includes(prop) && !Object.prototype.hasOwnProperty.call(target, prop)) {
        return Reflect.get(target, prop, receiver);
      }

      const propStr = typeof prop === 'symbol' ? prop.toString() : String(prop);
      const currentKey = key ? `${key}.${propStr}` : propStr;

      const found = prop in target;
      if (!found && !hasCb) {
        throw new Error(`Property '${currentKey}' does not exist`);
      }

      let value = found ? Reflect.get(target, prop, receiver) : undefined;

      if (hasCb) {
        value = ctx.cb({ key: currentKey, value, found });
      }

      // eslint-disable-next-line @blackflux/rules/prevent-typeof-object
      if (value !== null && typeof value === 'object') {
        return SafeProxy(value, ctx, currentKey);
      }

      return value;
    },
    ...(hasCb === true ? { has() { return true; } } : {})
  });
};

export default (tgt, ctx) => SafeProxy(tgt, ctx);
