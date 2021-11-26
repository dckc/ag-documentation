# Secure Distributed Computing in JavaScript

The Agoric smart contract platform starts with a JavaScript framework
for secure distributed computing. The unit of synchrony is the _vat_,
and vats use the communicating event loop model of concurrency.

::: tip Watch: Distributed Programming for a Decentralized World
<iframe width="560" height="315" src="https://www.youtube.com/embed/52SgGFpWjsY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
:::

- **[Hardened JavaScript](./hardened-js.md)**
  - Hardened JavaScript provides a platform for
    making objects that can interact with code you don't completely trust,
    without being vulnerable to bugs or bad intentions.
    We introduce object capabilities and how to use them
    to apply the principle of least authority.

- **[`E()` for eventual send to remote objects](./eventual-send.md)**
  - The `E()` wrapper function lets
    you invoke methods on remote objects, whether in another vat, machine, or blockchain (for example).
    Given a local representative (a *presence*) for a remote object,
    it sends messages to the origin of the presence.
    `E(obj).myMethod(...args)` is an asynchronous form of `obj.myMethod(...args)`.

- **[`Far()` and remotable objects](./far.md)**
  - Objects intended to be used from other vats are called *remotables*.
    To mark an object as remotable, use the `Far()` function.

- **[Notifiers and Subscriptions](./notifiers.md)**
  - Notifiers and Subscriptions distribute state change
    updates. Both deliver an asynchronous stream of messages as a publish-subscribe system
    might, without requiring explicit management of lists of subscribers. Notifiers are
    lossy conveyors of non-final values while subscriptions are lossless value conveyors.
