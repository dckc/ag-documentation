import { test } from '@agoric/zoe/tools/prepare-test-env-ava.js';
import { start as hello1 } from './hello1.js';

test('Hello, World! test', async t => {
  const zcfDummy = undefined;
  const { publicFacet } = hello1(zcfDummy);

  const result1 = publicFacet.get();
  t.log('public method get() returned:', result1);
  t.is(result1, 'Hello, Zoe!');

  publicFacet.set('Goodbye.');
  const result2 = publicFacet.get();
  t.log('after set(), get() returned:', result2);
  t.is(result2, 'Goodbye.');
});
