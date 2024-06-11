import fs from 'smart-fs';
import { expect } from 'chai';
import { describe } from 'node-tdd';
import jsonSmartParse from '../../src/core/json-smart-parse.js';

const filename = fs.filename(import.meta.url);
const fixtureDir = `${filename}__fixtures`;

describe('Testing jsonSmartParse', () => {
  // eslint-disable-next-line mocha/no-setup-in-describe
  fs.walkDir(fixtureDir).forEach((file) => {
    it(`Testing ${file}`, async ({ fixture }) => {
      const { input, expected } = fixture(file);
      const result = jsonSmartParse(input);
      expect(result).to.deep.equal(expected);
    });
  });
});
