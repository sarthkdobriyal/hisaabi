---
title: "Your expense tracker is reading your bank SMS"
description: "Most Indian expense trackers auto-track by reading your bank SMS. Here's what they actually see, why it matters, and how to track expenses without SMS access."
date: 2026-08-06
tags:
  - Privacy
  - India
  - SMS
author: "Sarthak Dobriyal"
cover: "https://plus.unsplash.com/premium_photo-1681589453747-53fd893fa420?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
related: []
---

Somewhere on your phone is an app that knows where you spent money last Diwali. It doesn't know because you told it. It knows because it read your bank's SMS.

If you use one of India's popular expense trackers — the ones that promise to "auto-track your spending" — that app has been quietly reading your messages. Not just bank alerts: the permission it needs gives it access to your entire inbox. This is how most auto-tracking expense apps in India work, and it's a trade you probably didn't realize you were making.

Here's what's actually happening, what those apps can see, and how to get the insight without handing over your messages.

## What "auto-tracking" actually means: your bank SMS

When you spend money — UPI, card, wallet, a bank transfer — your bank sends a transaction SMS. Those messages are remarkably consistent: an amount, a merchant name, a date, and often your account number and running balance. They're essentially receipts the bank writes for you.

Auto-tracking apps build their whole product on those receipts. Give one the SMS permission, and every time a new transaction message arrives, the app reads it, pulls out the merchant and amount, and logs an expense. No typing, no entries to fill in. That's the "auto" in auto-tracking.

The apps are upfront about this. In its [FAQ](https://moneyview.in/money-view-app-faq) and [blog](https://moneyview.in/blog/now-track-paytm-wallet-moneyview/), Moneyview explains that it reads financial and transactional SMS from billers to present an automatic view of your finances without manual effort, categorizing spending from those messages and using the same data when evaluating loan eligibility. It's the same model across Walnut, Axio, and most of the auto-trackers popular in India. The tradeoff is stated in permissions popups and privacy policies — what most people don't realize is how broad the access really is.

## The permission behind it: READ_SMS — and why Google restricted it

The permission these apps ask for is called `READ_SMS`. On Android it does what it says: the app can read every text message on your device. Not just bank alerts — OTPs, courier updates, your family group chats, the two-factor codes from your employer.

That breadth is the problem, and Google has spent years clamping down on it. Play Store policy now restricts `READ_SMS` so tightly that, realistically, only a phone's default SMS app can request it. Third-party finance apps that want the old auto-scan behavior have to jump through exception hoops — a direct result of the permission being abused. As [one analysis](https://www.creditcaptain.com/blog/5-privacy-risks-in-expense-tracking-apps) of privacy risks in expense trackers put it, SMS-based tracking requires one of the broadest permissions an Android app can request: the ability to read all your text messages.

The practical consequence: the "read my bank SMS" model is a shrinking, dying breed on Android, and it never existed on iOS in the first place. Apps are quietly pivoting to email parsing, notification reading, or manual entry — which is honestly where the whole category is heading.

## What those apps actually see (and what they say they don't)

The apps are careful to reassure you. Moneyview, for instance, [states](https://moneyview.in/money-view-app-faq) that it never reads OTPs or security codes and that it encrypts data. That's a meaningful claim, and it's probably true in the narrow sense that the app's code ignores OTP-looking messages.

But here's the thing about `READ_SMS`: it's an all-or-nothing permission. The app's code decides what to read and what to ignore. You're not granting access to "bank alerts only" — you're granting access to everything, and trusting that the app filters correctly, that a future update doesn't change that behavior, and that nothing on the app's side leaks.

What those messages contain goes beyond the merchant and amount. Transaction messages include your account number, your remaining balance, and sometimes your card's last four digits. That's not just spending data — it's financial identity data, sitting in a company's database for as long as it chooses to keep it, and shared in ways a permission popup doesn't tell you about.

![Your money, your history](https://images.unsplash.com/photo-1592890288564-76628a30a657?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)

Compare that with the thing everyone treats as the crown jewel of their online life: the password. A password can be changed in sixty seconds. Your spending history can't. It's a permanent record of your life — and these apps read it wholesale to build a feature you could replicate with a few taps a day.

## Why it matters more than you think

It's easy to wave this off — "I don't do anything embarrassing, who cares what an app sees." The stakes aren't embarrassment. They're permanence and leverage.

Your transaction history is one of the few things about you that never resets. Every app that collects it keeps a copy forever. It feeds loan decisions, marketing profiles, and — if there's a breach — it's your account numbers and balances that leak, not your social media likes. There's a reason the most sensitive data you own isn't your password; it's your transaction history. A password you can change; your history you can't. That's why serious finance apps treat transaction data as something to minimize, not hoard — the way we explain in our [guide to private expense tracking](/guides/private-expense-tracking).

Once you see it that way, "which app do I trust my messages with" becomes the wrong question. The right question is: why does any app need my messages at all? The answer, increasingly, is that it doesn't.

A quick way to test how an app treats your data: open its privacy policy and search for the words *share*, *advertiser*, and *third party*. Auto-trackers that monetize their insights are rarely shy about it — they need the language to cover themselves. A tracker that stores everything locally won't have those sections at all, because there's nothing to share. That one search tells you more about the product than any feature tour.

## How to check whether an app on your phone reads your SMS

If you're on Android and want to know exactly which apps can currently read your messages:

1. Open **Settings**.
2. Go to **Apps** → **Special app access** (or search "special app access").
3. Tap **SMS access**.

That screen lists every app that holds `READ_SMS` permission. If an expense tracker, finance app, or credit-score app is on it, that app can read your SMS right now. Revoke it, and the app will usually degrade gracefully to manual entry — or nag you to re-enable it, which tells you everything about how much it relies on the access. Worth checking the **Notification access** list on the same screen too; some apps use notification reading as a workaround for the same goal.

On iOS, the situation is different: no third-party app can read your SMS at all. That's why you won't find auto-SMS trackers there — the platform simply doesn't allow it, and the category works around it with notification or email parsing instead.

## Tracking without SMS access

Here's the honest part: you don't need any app to read your messages to know where your money goes. You need two things — a habit of logging, and a tool that makes logging fast enough to stick.

The traditional answer is manual entry: opening a tracker, tapping "add expense," typing the amount and category. It's private, but it's friction, and friction is why people give up after a week. That's the gap a chat-based tracker fills. Instead of forms, you type "spent 300 on chai" and it logs the expense. Same privacy as manual entry — nothing reads your SMS, nothing connects to your bank — but the entry cost is roughly that of sending a message.

Hisaabi works that way. Your data never leaves your device, there's no account to create and no SMS permission to grant, and the AI turns your sentence into a categorized entry, as we explain in our [guide to AI expense tracking](/guides/ai-expense-tracking). It's local-first by design, which means the "what does the company do with my data" question has an unusually clean answer: the company never stores your data at all — it lives only on your device, something our [privacy guide](/guides/private-expense-tracking) walks through.

Is it as effortless as fully-automatic tracking? No, and it's worth being straight about that. Auto-tracking is zero-effort on good days and subtly wrong on others — it misses cash entirely, and cash is the gap that quietly breaks most Indian budgets, as we cover in our [guide to tracking expenses in India](/guides/track-expenses-in-india). Manual and chat-based tracking cost you a few seconds a day, and in exchange you get complete, accurate data and total privacy. For most people, that trade is worth it.

## Bottom line

The apps asking for your SMS access aren't evil, and many genuinely help people who'd never open a tracker otherwise. But the access they're asking for is enormous — your entire inbox, read permanently, in exchange for auto-categorization. Google is already restricting the permission because it's too broad, and the industry is moving away from it.

You don't have to choose between knowing where your money goes and keeping your messages private. Track without the SMS permission. Your bank alerts are the only thing that ever needed to read them — and they're already in your inbox, where they belong.

[Try Hisaabi](/app) — or read more about [why your spending history deserves local storage](/) on the homepage.
