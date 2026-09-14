---
title: How does Vylo protect my bank information?
description: >-
  Read-only bank access, protected sign-ins, and the privacy controls available
  to you.
category: account
order: 63
keywords:
  - security
  - safe
  - Plaid
  - Finicity
  - Mastercard
  - bank password
  - read only
  - privacy
related:
  - ai-categorization
  - signed-in-devices
  - download-your-data
  - delete-account
---

Vylo’s bank access is **read-only**. It can receive balances and transactions, but it cannot use that connection to pay bills, withdraw money, or transfer funds.

## How are bank connections established?

Vylo uses bank-connection providers including **Plaid** and **Finicity, a Mastercard company**. Some connections are established through **Quiltt**, which coordinates the provider’s connection flow. You choose your bank, complete its sign-in and verification steps through the provider, and select which accounts to share.

The provider handles bank authorization. **Vylo does not store your banking password.** Connection credentials used by Vylo are kept on the server and encrypted at rest; they are not exposed in the app or browser.

## How are my sign-in and data protected?

- **Encrypted communication.** Vylo uses secure connections for app traffic and database access.
- **Hashed passwords.** Vylo stores a one-way password hash, not your password in readable form.
- **Two-step sign-in.** New devices require a one-time code sent to your email. This protection is always on.
- **Protected sessions.** Sign-in tokens expire and refresh credentials are rotated. Reusing an old refresh credential revokes the affected session.
- **Password-reset safeguards.** Reset links expire, work once, and revoke existing trusted sign-ins when your password changes.
- **Limits on repeated attempts.** Sign-in and password-reset requests are rate-limited to make automated guessing harder.
- **Household access checks.** Vylo checks which household you belong to before returning its data. Removing a member revokes their access.
- **Verified bank-provider notifications.** Vylo checks provider messages before using them to trigger account updates.

On the web, protected cookies and checks on requests that change data help prevent other sites from acting as your account. Operational logs are designed to leave out passwords, tokens, and other sensitive credentials.

On iPhone, sign-in credentials are stored in the device’s Keychain with protection that restricts them to that device. You can enable Face ID in Privacy & Security and hide sensitive amounts with the eye control in the app. Revealing hidden values requires device authentication.

## What about merchant logos?

To display a merchant logo, Vylo can send the merchant’s saved website domain to Logo.dev. That request does not include transaction details.

## What can I control?

You can review [signed-in devices](/help/articles/signed-in-devices/), [disconnect a bank](/help/articles/remove-a-bank/), [download your data](/help/articles/download-your-data/), or [delete your account](/help/articles/delete-account/).

[AI categorization](/help/articles/ai-categorization/) requires a separate, explicit choice from the person who connected the bank. You can withdraw it in **Settings → Privacy & Security** without losing ordinary transaction sorting.

## What if I notice something suspicious?

For an unfamiliar bank charge, contact your bank or card issuer. Vylo cannot freeze a card or reverse a payment.

For a sign-in you don’t recognize, revoke that session, reset your Vylo password, and email **hi@myvylo.com**. We won’t ask you to send a bank password or verification code.
