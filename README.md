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

### align(obj: Object, ref: Object)

Align the ordering of one object recursively to a reference object.

_Example:_
<!-- eslint-disable no-undef -->
```js
const obj = { k1: 1, k2: 2 };
const ref = { k2: null, k1: null };

align(obj, ref);
// obj => { k2: 1, k1: 2 }
```

### contain(tree: Object, subtree: Object)

_Example:_
<!-- eslint-disable no-undef -->
```js
const { contain } = require('object-lib');

contain({ a: [1, 2], b: 'c' }, { a: [1, 2] });
// => true

contain({ a: [1, 2], b: 'c' }, { a: [1] });
// => false
```
