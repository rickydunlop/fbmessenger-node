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
