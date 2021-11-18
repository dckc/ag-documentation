import { Far } from '@agoric/marshal';

export const start = _zcf => {
  let value = 'Hello, Zoe!';
  const publicFacet = Far('hello', {
    get: () => value,
    set: v => (value = v),
  });
  return { publicFacet };
};
