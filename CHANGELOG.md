# Changelog

## 5.0.0

* **Breaking Change**
  * Generic Template now expects an object instead of an array of elements
  * **New Feature**
   * Support for Attachment Upload API
   * Added support for `pre_checkout` event

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
