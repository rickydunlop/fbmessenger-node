# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="5.0.2"></a>
## [5.0.2](https://github.com/rickydunlop/fbmessenger-node/compare/v5.0.1...v5.0.2) (2018-06-26)


### Bug Fixes

* export opengraph element and template ([1e78fa7](https://github.com/rickydunlop/fbmessenger-node/commit/1e78fa7)), closes [#42](https://github.com/rickydunlop/fbmessenger-node/issues/42)



<a name="5.0.1"></a>
## [5.0.1](https://github.com/rickydunlop/fbmessenger-node/compare/v5.0.0...v5.0.1) (2018-05-04)


### Bug Fixes

* **package:** update [@commitlint](https://github.com/commitlint)/cli to version 5.0.0 ([#27](https://github.com/rickydunlop/fbmessenger-node/issues/27)) ([5590080](https://github.com/rickydunlop/fbmessenger-node/commit/5590080))
* **package:** update [@commitlint](https://github.com/commitlint)/cli to version 6.0.0 ([fc70cee](https://github.com/rickydunlop/fbmessenger-node/commit/fc70cee))
* **package:** update [@commitlint](https://github.com/commitlint)/config-angular to version 5.0.0 ([#28](https://github.com/rickydunlop/fbmessenger-node/issues/28)) ([b3da475](https://github.com/rickydunlop/fbmessenger-node/commit/b3da475))
* **package:** update [@commitlint](https://github.com/commitlint)/config-angular to version 6.0.2 ([3614253](https://github.com/rickydunlop/fbmessenger-node/commit/3614253))



# Changelog

## 5.0.0

* **Breaking Change**
  * Generic Template now expects an object instead of an array of elements
  * Node 6 is now the minimum supported version
* **New Feature**
   * Support for Attachment Upload API
   * Support for new Messenger Profile API
   * Added support for Messenger Code API
   * Added support for `pre_checkout` event
   * Added Open Graph template
   * Supports message tags
   * NLP can be enabled/disabled
 * **Internal**
  * Facebook API version moved to constants file for consistency

## 4.0.0

 * **Breaking Change**
  * Removed `Messenger.lastMessage` as it caused race conditions, you must explicitly pass the
   recipient's user id to `send`, `getUser` and `senderAction`.
  * MessengerClient merged into Messenger class
  * Button template signature has changed for consistency with other elements
 * **New Feature**
  * Errors are now checked for in the response and thrown
  * Added `is_payment_enabled` to user query fields
  * Added Changelog
  * Added support for `referral`, `checkout_update` and `payment` events
 * **Internal**
  * Tests switched from Mocha to Jest
  * Updated dependencies
  * Updated examples
  * Renamed `lib` directory to `src`
  * Added GET, POST and DELETE helper methods
