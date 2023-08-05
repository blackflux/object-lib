# object-lib

[![Build Status](https://circleci.com/gh/blackflux/object-lib.png?style=shield)](https://circleci.com/gh/blackflux/object-lib)
[![Test Coverage](https://img.shields.io/coveralls/blackflux/object-lib/master.svg)](https://coveralls.io/github/blackflux/object-lib?branch=master)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=blackflux/object-lib)](https://dependabot.com)
[![Dependencies](https://david-dm.org/blackflux/object-lib/status.svg)](https://david-dm.org/blackflux/object-lib)
[![NPM](https://img.shields.io/npm/v/object-lib.svg)](https://www.npmjs.com/package/object-lib)
[![Downloads](https://img.shields.io/npm/dt/object-lib.svg)](https://www.npmjs.com/package/object-lib)
[![Semantic-Release](https://github.com/blackflux/js-gardener/blob/master/assets/icons/semver.svg)](https://github.com/semantic-release/semantic-release)
[![Gardener](https://github.com/blackflux/js-gardener/blob/master/assets/badge.svg)](https://github.com/blackflux/js-gardener)

## Getting Started

    $ npm install --save-dev object-lib

## Functions

For more extensive examples, please refer to the tests.

### align(obj: Object, ref: Object)

Align the ordering of one object recursively to a reference object.

_Example:_
<!-- eslint-disable import/no-unresolved,import/no-extraneous-dependencies -->
```js
import { align } from 'object-lib';

const obj = { k1: 1, k2: 2 };
const ref = { k2: null, k1: null };

align(obj, ref);
// obj => { k2: 1, k1: 2 }
```

### clone(obj: Object[], needles: Array<String> = [])

Deep clone object.

Fields targeted by passed needles are created as a reference and not cloned.

Fields targeted by excluded needles are removed entirely from the result.

Needles are declared using the [object-scan](https://github.com/blackflux/object-scan) syntax.

_Example:_
<!-- eslint-disable import/no-unresolved,no-console,import/no-extraneous-dependencies -->
```js
import { clone } from 'object-lib';

const data = { a: {}, b: {}, c: {} };
const cloned = clone(data, ['b', '!c']);

console.log(cloned);
// => { a: {}, b: {} }
console.log(cloned.a !== data.a);
// => true
console.log(cloned.b === data.b);
// => true
```

### contains(tree: Object, subtree: Object)

Check if `subtree` is contained in `tree` recursively.

Different types are never considered _contained_.

Arrays are _contained_ iff they are the same length and every
element is _contained_ in the corresponding element.

Objects are _contained_ if the keys are a subset,
and the respective values are _contained_.

All other types are contained if they match exactly (`===`).

_Example:_
<!-- eslint-disable import/no-unresolved,import/no-extraneous-dependencies -->
```js
import { contains } from 'object-lib';

contains({ a: [1, 2], b: 'c' }, { a: [1, 2] });
// => true

contains({ a: [1, 2], b: 'c' }, { a: [1] });
// => false
```

### Merge(logic: Object = {})(...obj: Object[])

Allows merging of objects. The logic defines paths that map to a field, or a function, to merge by.

If a function is passed, it is invoked with the value, and the result is used as the merge identifier.

The paths are defined using [object-scan](https://github.com/blackflux/object-scan) syntax.

_Example:_
<!-- eslint-disable import/no-unresolved,import/no-extraneous-dependencies -->
```js
import { Merge } from 'object-lib';

Merge()(
  { children: [{ id: 1 }, { id: 2 }] },
  { children: [{ id: 2 }, { id: 3 }] }
);
// => { children: [ { id: 1 }, { id: 2 }, { id: 2 }, { id: 3 } ] }

Merge({ '**[*]': 'id' })(
  { children: [{ id: 1 }, { id: 2 }] },
  { children: [{ id: 2 }, { id: 3 }] }
);
// => { children: [ { id: 1 }, { id: 2 }, { id: 3 } ] }
```
