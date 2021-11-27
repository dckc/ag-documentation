# Introduction to Zoe

::: tip Beta status
Zoe is currently at Beta status. It has not yet been
formally tested or hardened. It is not yet of production quality.
:::

::: tip Work in Progress: Fees and Metering
We recently started
charging fees for using Zoe. If you are experiencing problems running
dapps, please make sure your fee purse has enough RUN to pay fees. For
more information about how fees are charged and how some fees are used
to pay for code execution, please see our [work-in-progress
documentation](/zoe/api/fees-and-metering.md). We expect that this model will change in the upcoming
few months. 
:::

## What is Zoe?

Zoe is the Agoric smart contract framework. It provides _offer safety_,
enforcing the previously implicit agreement that, for example, if I hand my
dollar to a fruit vendor, I will get an apple in exchange.

## Zoe and Offer Safety

Zoe is based on offers, rather than one-way transactions. An offer
expresses what is wanted (an apple) as well as what is given (a dollar).

## Why use Zoe?

### For Users ###

**Zoe is safer.** Before Zoe, putting digital assets in a smart
contract has risked losing them. But Zoe guarantees you get either
what you wanted or a full refund of the assets you put in. You will
never leave a contract empty-handed, even if the smart contract is
buggy or malicious. 

### For Developers ###

**Zoe is easier.**  Before Zoe, writing a smart contract often meant
learning a new, untried language. And don't make any mistakes - if you
do, your users might lose millions.

However, you write Zoe contracts in Hardened JavaScript.
Moreover, Zoe automatically escrows all user digital assets and
handles their subsequent payout. **Even a buggy contract can't cause
users to lose their assets.**

## Hello, Zoe!

Let's have a look at a simple JavaScript smart contract.

<<< @/snippets/zoe/hello1.js

The contract is defined by an `start` function, exported
using standard module syntax. This is mostly an ordinary
JavaScript function that declares a `value` variable,
makes an object with `get` and `set` methods, and returns it. A few
things are a bit out of the ordinary:

 - We recommend arrow (`=>`) function style for clarity;
   in _Hardened JavaScript @@TODO_ we'll go into more
   detail on recommendations and requirements for using
   JavaScript securely.
 - `_zcf` is prefixed with `_` to mark it unused;
   we'll discuss the _Zoe Contract Facet @@TODO link_ a little later.
 - `Far` marks an object as suitable for remote use;
    _Distribute Object Model @@TODO_ for more.

## Controlling Access with Object Capabilities (OCaps)

To control who has access to the `set` method, we can move it
from the `publicFacet` to a `creatorFacet`:

<<< @/snippets/zoe/hello-facets.js

The public facet is available to anyone who asks
(using [getPublicFacet](/zoe/api/zoe.html#e-zoe-getpublicfacet-instance)),
but the `creatorFacet` is only returned to the caller that
starts the contract (using [startInstance](/zoe/api/zoe.html#e-zoe-startinstance-installation-issuerkeywordrecord-terms)).

This pattern of multiple object providing different access to some shared state
(the `value` variable) is one of many _patterns of
cooperation without vulnerability_ that are straightforwardly expressed using
the Object Capability (OCap) security model. _@@TODO: OOP/encapsulation_
_@@fwd ref? prune para?_

### Contracts on Zoe

Agoric has written [a number of example contracts that you can
use](/zoe/guide/contracts/), including:
* an [Automated Market Maker (AMM)
  implementation](/zoe/guide/contracts/multipoolAutoswap.md)
* a [covered call option
  contract](/zoe/guide/contracts/covered-call.md)
* an [OTC Desk market maker
  contract](https://github.com/Agoric/agoric-sdk/blob/master/packages/zoe/src/contracts/otcDesk.js)
* contracts for [minting fungible](https://github.com/Agoric/agoric-sdk/blob/master/packages/zoe/src/contracts/mintPayments.js) and [non-fungible tokens](https://github.com/Agoric/agoric-sdk/blob/master/packages/zoe/src/contracts/mintAndSellNFT.js)

## Using an example Zoe smart contract

You must have a Zoe invitation to a specific contract instance to join
and participate in it. Let's imagine your friend Alice has sent you a
`Zoe invitation` for a contract instance to your
[wallet](/guides/wallet/). 

Compare this to a smart contract on Ethereum. On Ethereum, the smart
contract developer must guard against malicious calls and store an
internal access control list to check whether the message sender is
allowed to send such a message. Zoe, built on Agoric's [object
capability](/glossary/#object-capabilities) security model, is just
easier.

This particular invitation is for an [AtomicSwap
contract](https://github.com/Agoric/agoric-sdk/blob/master/packages/zoe/src/contracts/atomicSwap.js).
In an AtomicSwap, one party puts up digital assets they want to
exchange and sends an invitation to a second party for them to
possibly complete the exchange. In this example, Alice has already
escrowed the assets she wants to swap and is asking you to pay a
specified price to receive her digital assets.

### Inspecting an invitation

So you have an invitation, but how do you use it? First, you use Zoe
to inspect and validate the invitation.

<<< @/snippets/test-intro-zoe.js#details

::: warning Note

E() is part of the Agoric platform and is used to [call methods on
remote objects and receive a promise for the
result](/guides/js-programming/eventual-send.md).
Code on the Agoric platform is put in separate environments, called
[vats](/glossary/#vat), for security. Zoe is in a different vat,
making it a remote object, so we must use E().
:::

Invitations include information about their contract's installation.
Essentially, this is the contract's source code as installed on Zoe.
From this overall contract installation, people use Zoe to create and
run specific instances of the contract. For example, if a real estate
company has a contract for selling a house, they would create an
instance of the contract for each individual house they have up for
sale.

You use object identity comparison to quickly check that you recognize
this contract installation, without having to check source code
line-by-line to ensure the code is the same. In other words, you're
sure this invitation is for participating in an instance of the
contract it says it is, and not an unknown and possibly malicious one.

<<< @/snippets/test-intro-zoe.js#isCorrectCode

However, if you don't recognize the installation, you can inspect the
code directly by calling:

<<< @/snippets/test-intro-zoe.js#inspectCode

In many cases, the bundled source is a single reviewable string.
In others, the bundle contains to base 64 encoded zip file that you can
extract for review.
```
jq -r .endoZipBase64 bundle.json | base64 -d > bundle.zip
unzip bundle.zip
```

Contracts can add their own specific information to invitations. In
this case, the Atomic Swap contract adds information about what is
being traded: the `asset`, the amount Alice has escrowed, and the
`price`, what you must pay to get the asset. Let's say `asset` is an
`amount` of 3 moola, and `price` is an `amount` of 7 simoleans. (Moola
and simoleans are made-up currencies for this example.) Amounts are
descriptions of digital assets, but have no value themselves. Please
see the ERTP guide for more on
[amounts](/ertp/guide/amounts.md#amounts-values-and-brands).

### Making an offer

You've successfully checked out the invitation, so now you can make an
offer.

An offer has three required parts:
* a Zoe invitation
* a proposal
* the digital assets you're offering to swap

The `proposal` states what you want from the offer, and what you will
give in return. Zoe uses the proposal as an invariant to ensure you
don't lose your assets in the trade. This invariant is known as **offer
safety**.

You use the invitation's `asset` and `price` amounts to make your
proposal: 

<<< @/snippets/test-intro-zoe.js#ourProposal

Proposals must use Keywords, which are capitalized ASCII keys. Here,
the specific keywords, `Asset` and `Price`, are [determined by the
contract
code](https://github.com/Agoric/agoric-sdk/blob/23c3f9df56940230e21a16b4861f40197192fdea/packages/zoe/src/contracts/atomicSwap.js#L29).

You said you would give 7 simoleans, so you must send 7 simoleans as
an [ERTP payment](/ertp/guide/purses-and-payments.md). ([ERTP
payments](/ertp/guide/purses-and-payments.md) are how the Agoric
platform transfers fungible and nonfungible digital assets.) You
happen to have some simoleans lying around in a simolean
[purse](/ertp/guide/purses-and-payments.md) (used to hold digital
assets of a specific type). You withdraw a payment of 7 simoleans from
the purse for your offer, and construct an object using the same
Keyword as your `proposal.give`:

<<< @/snippets/test-intro-zoe.js#getPayments

Now  you need to [harden](/guides/js-programming/ses/ses-guide.md) your
just created `proposal` and `payments` objects. Hardening is
transitively freezing an object. For security reasons, we must harden
any objects that will be passed to a remote object like Zoe.

<<< @/snippets/test-intro-zoe.js#harden

You've put the required pieces together, so now you can make an offer:

<<< @/snippets/test-intro-zoe.js#offer

At this point, Zoe burns your invitation and confirms its validity.
Zoe also escrows all of your payments, representing their value in
amounts as your `current allocation` in the contract.

### Using your UserSeat

Making an offer as a user returns a `UserSeat`. This seat represents
your position in the ongoing contract instance (your "seat at the
table"). You can use this seat to:

1. Exit the contract.
2. Get information about your position such as your current allocation.
3. Get your payouts from Zoe.

Check that your offer was successful:

<<< @/snippets/test-intro-zoe.js#offerResult

In response to your offer, the AtomicSwap contract returns the
message: "The offer has been accepted. Once the contract has been
completed, please check your payout." Other contracts and offers may
return something different. The offer's result is entirely up to the
contract.

### Getting payouts

Because this was an AtomicSwap contract, it is over once the second
party escrows the correct assets. You can get your payout of moola
with the Keyword you used ('Asset'):

<<< @/snippets/test-intro-zoe.js#getPayout

Alice also receives her payouts:

<<< @/snippets/test-intro-zoe.js#alicePayout

## Writing and installing a contract

Now that you've seen how to participate in a contract instance, let's
look at how you'd create a contract and its instances.

Let's pretend Alice wrote that contract from scratch, even though
AtomicSwap is one of Agoric's example contracts ([see the full
AtomicSwap code
here](https://github.com/Agoric/agoric-sdk/blob/master/packages/zoe/src/contracts/atomicSwap.js)).
Note: All Zoe contracts must have this format:

::: details Show contract format
<<< @/snippets/contract-format.js#contractFormat
:::

Alice fills in this code template with [AtomicSwap's
particulars](https://github.com/Agoric/agoric-sdk/blob/master/packages/zoe/src/contracts/atomicSwap.js).
To install this particular code, Alice first must bundle it off-chain,
meaning the code and its imports are flattened together:

<<< @/snippets/test-intro-zoe.js#importBundleSource

<<< @/snippets/test-intro-zoe.js#bundle

Then Alice must install it on Zoe:

<<< @/snippets/test-intro-zoe.js#install

The return value is an `installation`, which we saw earlier. It is an
object identifying a particular piece of code installed on Zoe. It can
be compared to other installations, and you can call
`E(atomicSwapInstallation).getBundle()` to see the code itself.

### Creating an instance

Now Alice uses the installation to create a new instance. She must
also tell Zoe about the ERTP issuers she wants to use, by specifying
their role with Keywords. Alice was escrowing moola, so she uses the
keyword `Asset` to label the `moolaIssuer`. She wanted simoleans, so
she uses the keyword `Price` to label the `simoleanIssuer`. When you
create a new instance of the contract ([see permalink to line
58](https://github.com/Agoric/agoric-sdk/blob/23c3f9df56940230e21a16b4861f40197192fdea/packages/zoe/src/contracts/atomicSwap.js#L58))
by calling `startInstance()`, it returns a `creatorInvitation`. Alice
uses this to make her offer; even the instance's creator needs to have
an invitation to it to participate in it.

<<< @/snippets/test-intro-zoe.js#startInstance

As per the [Atomic Swap contract
code](https://github.com/Agoric/agoric-sdk/blob/23c3f9df56940230e21a16b4861f40197192fdea/packages/zoe/src/contracts/atomicSwap.js#L50),
Alice gets an invitation as a result of her offer. This is the
invitation she sends to the counter-party.

<<< @/snippets/test-intro-zoe.js#aliceOffer

## Zoe's two sides: Zoe Service and Zoe Contract Facet (ZCF)

You may have noticed the contract code's `start` method had a `zcf`
parameter. This is the Zoe Contract Facet. Zoe has two sides: the Zoe
Service, which you've seen users interact with, and the Zoe Contract
Facet (ZCF), which is accessible to the contract code. Note that users
have access to the Zoe Service, but do not have access to ZCF.
Contract code has access to ZCF *and* can get access to the Zoe
Service. 

To learn more about the Zoe Service, Zoe Contract Facet, and Zoe
Helper APIs, [see our Zoe API documentation](/zoe/api/).

## Next steps

If you want to dive deeper into how Zoe works and what you can do, go
to the [Zoe Guide](/zoe/guide/README.md). 

To learn more about the AtomicSwap contract, you can [read its
documentation](/zoe/guide/contracts/atomic-swap.md) and [look at its
source
code](https://github.com/Agoric/agoric-sdk/blob/master/packages/zoe/src/contracts/atomicSwap.js).
There are several other example contracts for different transaction
types in the [Contracts folder](/zoe/guide/contracts/)

To start building Zoe contracts and applications (dapps), follow the
instructions in [Starting a
Project](/getting-started/start-a-project.md) after [installing the
prerequisites](/getting-started/before-using-agoric.md).

To explore the Zoe Service and Zoe Contract Facet APIs, see the [Zoe
API documentation here](/zoe/api/).
