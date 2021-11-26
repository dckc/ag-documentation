import { Far } from '@agoric/marshal';

export const start = _zcf => {
  let value = 'Hello, World!';
  const creatorFacet = Far('hello', {
    set: v => (value = v),
  });
  const publicFacet = Far('hello', {
    get: () => value,
  });
  return { creatorFacet, publicFacet };
};
