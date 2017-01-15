const path = require('path');
const fs= require('fs');
const { transformFileSync } = require('babel-core');
const plugin = require('../lib/index').default;

function trim(str) {
  return str.replace(/^\s+|\s+$/, '');
}

describe('Remove Module Plugin', () => {
  const fixturesDir = path.join(__dirname, 'fixtures');
  fs.readdirSync(fixturesDir).map((caseName) => {
    if (!fs.statSync(path.join(fixturesDir, caseName)).isDirectory()) return;
    it(`should ${caseName.split('-').join(' ')}`, () => {
      const fixtureDir = path.join(fixturesDir, caseName);
      const actualPath = path.join(fixtureDir, 'actual.js');
      const actual = trim(transformFileSync(actualPath, {
        plugins: [[plugin,{ modules: ['param-types', 'A', 'B', 'C'] }]],
      }).code).replace(/not_in_use_\d+/g, 'not_in_use_xxxx');

      const expected = fs.readFileSync(
          path.join(fixtureDir, 'expected.js')
      ).toString();

      expect(actual).toEqual(trim(expected));
    });
  });
});
