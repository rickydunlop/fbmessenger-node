# Changelog
## 4.0.0

 * **Breaking Change**
  * Removed lastMessage due to race conditions, you must explicitly pass the
   recipient user id to `send`, `getUser` and `senderAction`.
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
