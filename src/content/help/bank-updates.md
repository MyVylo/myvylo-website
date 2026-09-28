---
title: Why isn’t my bank updating?
description: A failed update can be temporary. Reconnect only when Vylo asks you to.
category: bank-connections
order: 7
keywords:
  - sync failed
  - latest sync failed
  - bank disconnected
  - updates delayed
  - RBC
  - authorization expired
  - reconnect
  - connection status
related:
  - how-often-transactions-sync
  - reconnect-a-bank
  - missing-transactions
---

A failed update doesn’t always mean your bank has disconnected. The message in **Accounts** tells you whether to wait or reconnect.

## What does the message mean?

### “Sync failed” or “Latest sync failed”

Your bank is still linked, but its latest update didn’t finish. Your saved transactions remain available. **Last synced** shows the most recent successful update.

You don’t need to disconnect the bank. Vylo will clear the notice after a successful sync. You can dismiss the current notice, but it may return if a later update also fails.

### “Reconnect”

Your bank needs you to sign in or verify access again before updates can resume. Use **Reconnect** and follow the prompts. Your accounts may still be listed while their authorization needs renewing.

## What should I do?

1. Check the affected bank and its **Last synced** time in **Accounts**. Other banks may still be updating normally.
2. If you see **Reconnect**, use it. If the flow stops, open your bank’s app or website and look for a required security step, new terms or a password reset.
3. If you only see a failed-sync notice, give it time. Don’t delete and re-add the bank or keep retrying. If it remains stuck, contact us below.

Keep your bank’s security protections on. Repeated attempts won’t bypass a verification requirement.

## Why can an update fail?

Your bank, its connection provider or Vylo may have a temporary problem. A connection may also need attention after permission expires, you change a password or multi-factor setting, or the bank requests another security step. [Quiltt explains the different connection states](https://www.quiltt.dev/api/connections#troubleshooting-connection-errors), and [Plaid documents common authorization errors](https://plaid.com/docs/errors/item/).

These are possible causes, not a diagnosis of your account.

## Can I check my bank’s connection history?

[Monarch’s public connection-status dashboard](https://www.monarch.com/connection-status) offers broader context about institutions and data providers. It is not a live status page for Vylo. Monarch’s results may use a different provider, so don’t use them as a reason to disconnect an account or switch banks.

RBC customers may receive a two-step verification prompt on a trusted device. That security check doesn’t mean RBC disconnects more often. If you don’t recognize the sign-in, follow [RBC’s guidance](https://www.rbcroyalbank.com/ways-to-bank/tutorials/general/2-step-verification.html) and choose **Do Not Allow**.

## Still stuck?

Tell us the bank’s name, the message you see, when it last updated, and whether you’re using iOS or the web. We can investigate and help you choose the next step.

[Contact support](mailto:help@myvylo.com?subject=Bank%20update%20help), or email **help@myvylo.com**.

Please don’t send passwords, PINs, verification codes or full account numbers. If you include a screenshot, cover any financial or personal details we don’t need.
