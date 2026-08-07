---
title: "I built Hisaabi to keep your money data local"
description: "Most trackers copy your spending to a server. I built Hisaabi so your expenses never leave your device — here's the why, honestly explained."
date: 2026-08-08
tags:
  - Privacy
  - Local-first
author: "Sarthak Dobriyal"
cover: "https://images.unsplash.com/photo-1483546416237-76fd26bbcdd1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
related:
  - how-hisaabi-encrypts-your-data
  - what-data-stays-on-your-device-means
  - your-expense-tracker-is-reading-your-bank-sms
---

![Where does your money data live?](/images/blog/local-vs-cloud.svg)

Somewhere in my history, there's a version of me that used a cloud expense tracker and felt fine about it. And then one day I opened its privacy policy — not because I was paranoid, but because I was curious about one line, and the line led to another, and within an hour I realized I didn't actually know where my spending history lived, who could read it, or how long it would stay there after I deleted the app.

I didn't feel angry about it. I felt like I'd been lazy about something that mattered. A password you can change in sixty seconds. Your spending history is the only record of your life that doesn't reset — and I had handed it over without reading the terms.

So when I started building Hisaabi, I set one hard rule before writing any code: **no server, no account, no cloud.** Not "we take privacy seriously." Not "your data is encrypted on our servers." No server. The record of your money lives on your device, and nowhere else.

This post is the honest version of why.

## The problem isn't a bad app. It's a copy.

Most finance apps aren't run by villains. They're run by teams who made a reasonable decision: put the data on a server, because that's how you build sync, onboarding, analytics, and a business.

But here's the thing nobody says out loud. The moment you log an expense in one of those apps, **a second copy of your financial life exists** — on their machines. And that copy doesn't go away when you delete the app. It feeds marketing profiles. It gets merged into credit models. And if their security ever fails, it's your account numbers and balances in the breach, not your liked posts.

![Keep your own records](https://images.unsplash.com/photo-1590065707046-4fde65275b2e?q=80&w=1330&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)

I don't say this to scare you. I say it because it's the actual trade you're making, and most people make it without ever being told. If you track money in a cloud app, there is a copy of your spending that you do not control. That's not a bug in the model — it's the model.

## The fix isn't better servers. It's no server.

Here's what building local-first actually changed for me as a developer. Every feature I shipped, I first had to ask: *does this need anyone else's machine?* Logging an expense? No. Categorizing it? No. Answering "how much did I spend on food this month?" No — that's a query over data sitting right there in the browser's own database. Reminders, budgets, balances, charts? None of it needs a server.

The only thing that legitimately leaves your device is the message you choose to send to your own AI provider when you chat — with *your* key, to *your* chosen provider, or nothing at all if you run Ollama locally. That's the entire network story, and you can prove it yourself: open the [app](/app), open DevTools, watch the Network tab. One request, to the provider you picked. That's it.

Once there's no server, a whole category of questions stops being about trust. "What do they do with my data?" becomes "there is no *they*." Our [privacy policy](/privacy) is short for exactly this reason.

## The one copy you keep is now the one that's locked

Keeping data on your device is great — right up until someone else picks up your device. So the second half of the story is encryption.

When you turn on the passcode lock in Settings, every expense, income, and chat message is sealed with **AES-256 encryption** — the same cipher family used in banking and TLS — and the key is derived from *your* passcode using PBKDF2 with 600,000 rounds, never stored anywhere. While the app is locked, the only thing on the device is unreadable ciphertext. Auto-lock closes the door after a few idle minutes, so the sealed version is the default state of your data, not the exception.

I wrote the whole mechanism up in a [technical post](/blog/how-hisaabi-encrypts-your-data) because I think you should be able to read how your privacy works, not take it on faith.

## Let me be straight about what local doesn't do

I don't want to oversell this, because that's how trust dies. Local-first and encryption protect your data **at rest** — device off, app locked. They do not protect against someone using your already-unlocked browser, a keylogger on your machine, or a weak passcode you chose. There is no software on earth that fixes those. So we say it plainly on the privacy page, and the [explainer post](/blog/what-data-stays-on-your-device-means) walks through exactly what the safe does and doesn't do.

I'd rather have you trust us a little less and understand us completely than the other way around. A tool for your money should never need a leap of faith.

## The bottom line

I don't think cloud expense trackers are evil. I think the copy problem is real, and I think most people would choose not to make it if the choice were explained to them — which is exactly why it usually isn't.

Hisaabi is my attempt to make the private choice the easy choice: you type "spent 450 on groceries," and it's logged. Your data stays in your pocket, sealed when you're away, and readable by no one — not even me, because there's no server for it to reach. That's the whole product, and it's [free to try](/app).

If you're curious how the encryption actually works under the hood, the [technical deep dive](/blog/how-hisaabi-encrypts-your-data) is next. Or start with the [private expense tracking guide](/guides/private-expense-tracking) for the broader picture.
