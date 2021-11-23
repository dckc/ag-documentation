/* eslint-disable no-use-before-define */
import { test } from '@agoric/zoe/tools/prepare-test-env-ava';

test('Date.now() always returns NaN', t => {
  const c1 = new Compartment();
  t.is(c1.evaluate(`Date.now()`), NaN);
});

test('Math.random is not available', t => {
  const c1 = new Compartment();
  t.throws(() => c1.evaluate(`Math.random()`));
});

test('cannot redefine includes method on Array', t => {
  t.throws(
    () =>
      Object.assign(Array.prototype, {
        includes: specimen => {
          fetch('/pwned-db', {
            method: 'POST',
            body: JSON.stringify(specimen),
          });
          return false;
        },
      }),
    { message: /read only property/ },
  );
});

// #region makeCounter1
const makeCounter1 = () => {
  let value = 0;
  return {
    increment: () => {
      value += 1;
      return value;
    },
    decrement: () => {
      value -= 1;
      return value;
    },
  };
};
// #endregion makeCounter1

test('count people coming and going', t => {
  // #region counter1
  const people = makeCounter1();
  const entryGuard = people.increment;
  const exitGuard = people.decrement;

  t.is(entryGuard(), 1);
  t.is(entryGuard(), 2);
  t.is(exitGuard(), 1);
  // #endregion counter1
});

test.skip('too maleable', t => {
  const launchTheMissiles = () => 'oh no!';
  c1.increment = () => launchTheMissiles();

  t.is(c1.increment(), 'oh no!');
});

// #region makeCounter
const makeCounter = init => {
  let value = init;
  return harden({
    increment: () => {
      value += 1;
      return value;
    },
    decrement: () => {
      value -= 1;
      return value;
    },
  });
};
// #endregion makeCounter

test('basic counter', t => {
  const c1 = makeCounter(1);
  t.is(c1.increment(), 2);

  t.is(c1.increment(), 3);
});

const makeWeakMap = () => new WeakMap();

// region: makeMint0
const makeMint1 = () => {
  const ledger = makeWeakMap();

  const issuer = {
    makeEmptyPurse: () => mint.makePurse(0n),
  };

  const mint = {
    makePurse: initialBalance => {
      const purse = harden({
        getIssuer: () => issuer,
        getBalance: () => ledger.get(purse),

        deposit: (amount, src) => {
          ledger.set(src, ledger.get(src) - amount);
          ledger.set(purse, ledger.get(purse) + amount);
        },
        withdraw: amount => {
          const newPurse = issuer.makeEmptyPurse();
          newPurse.deposit(amount, purse);
          return newPurse;
        },
      });
      ledger.set(purse, initialBalance);
      return purse;
    },
  };

  return mint;
};
// #region makeMint0

test('DRAFT: alice sends 10 to bob', t => {
  const dollarMint = makeMint1();
  const alicePurse = dollarMint.makePurse(100n);
  const bobPurse = alicePurse.getIssuer().makeEmptyPurse();

  const p1 = alicePurse.withdraw(10n);
  bobPurse.deposit(10n, p1);

  t.is(alicePurse.getBalance(), 90n);
  t.is(bobPurse.getBalance(), 10n);
});

const fail = why => {
  throw TypeError(why);
};
const Nat = x => (typeof x === 'bigint' && x >= 0n ? x : fail(`${x} not Nat`));

// #region makeMint
const makeMint = () => {
  const ledger = makeWeakMap();

  const issuer = harden({
    makeEmptyPurse: () => mint.makePurse(0n),
  });

  const mint = harden({
    makePurse: initialBalance => {
      const purse = harden({
        getIssuer: () => issuer,
        getBalance: () => ledger.get(purse),

        deposit: (amount, src) => {
          Nat(ledger.get(purse) + Nat(amount));
          ledger.set(src, Nat(ledger.get(src) - amount));
          ledger.set(purse, ledger.get(purse) + amount);
        },
        withdraw: amount => {
          const newPurse = issuer.makeEmptyPurse();
          newPurse.deposit(amount, purse);
          return newPurse;
        },
      });
      ledger.set(purse, initialBalance);
      return purse;
    },
  });

  return mint;
};
// #endregion makeMint

test('alice sends 10 to bob', t => {
  const dollarMint = makeMint();
  const alicePurse = dollarMint.makePurse(100n);
  const bobPurse = alicePurse.getIssuer().makeEmptyPurse();

  const p1 = alicePurse.withdraw(10n);
  bobPurse.deposit(10n, p1);

  t.is(alicePurse.getBalance(), 90n);
  t.is(bobPurse.getBalance(), 10n);
});
