---
title: How often do transactions sync?
description: >-
  Transactions sync in the background. The timing depends on your bank and its
  connection provider.
category: bank-connections
order: 6
keywords:
  - refresh
  - sync
  - delay
  - RBC
  - TD
  - CIBC
  - BMO
  - Scotiabank
  - Chase
  - 15 minutes
  - frequency
related:
  - missing-transactions
  - reconnect-a-bank
  - pending-transactions
---

Vylo imports new transactions in the background. **There is no single update schedule for every bank.** A purchase can appear in your bank’s app before it becomes available to Vylo.

## Why does one bank update faster than another?

Your bank has to make the transaction available to its connection provider before Vylo can import it. Some banks provide pending purchases; others wait until they post. Balances and transactions can also arrive at different times.

Even two accounts at the same bank can update differently. We don’t publish an hourly schedule for individual banks because it would suggest a guarantee their connections don’t provide.

## What does “Last synced” mean?

It tells you when Vylo last checked for available bank data. A successful check doesn’t mean the bank has finished processing every recent purchase.

On the web, open **Transactions**, then the three-dot menu beside **Filter**, and choose **Trigger Manual Sync**. Manual requests are normally limited to one every 15 minutes; the app shows when another request is available.

## When is a delay worth checking?

If a purchase has posted at the bank and is still missing after another day, follow [the missing-transaction checks](/help/articles/missing-transactions/) or email **hi@myvylo.com** with the bank name and transaction date.
