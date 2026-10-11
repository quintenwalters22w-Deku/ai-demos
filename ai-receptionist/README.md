# 24/7 Phone Answering (AI Receptionist) — Demo + Real Deployment Notes
Demo: open `index.html` in any browser (no server, no accounts). Add `?auto=1` to auto-play a sample call. Everything is simulated client-side; no calls, texts, or data leave the browser.

## Deploying for real (internal — don't name tools to customers)
1. **Voice agent:** Vapi or Retell (≈$0.07–$0.31/min per research) with a prompt built from the client's FAQ, services, service area, hours, pricing rules, and emergency keywords.
2. **Phone number:** new number from the voice platform/Twilio; client forwards their line on no-answer/after-hours (or all calls).
3. **Tools/functions the agent calls → n8n webhooks:** `check_availability` and `book_slot` (Google Calendar / Jobber / Housecall Pro API), `create_lead` (CRM or Google Sheet), `page_on_call` (emergency SMS to the tech).
4. **After the call:** the platform's end-of-call webhook → n8n → owner SMS/email summary (name, phone, issue, address, booked slot, transcript + recording link), plus a customer confirmation text.
5. **Compliance:** disclose that it's an AI assistant if required, call-recording notice (Arizona is one-party, but callers may be in other states), A2P 10DLC for any texts, no PHI for dental.
6. **QA:** 20+ test calls (FAQ, booking, emergency, angry caller, wrong number, Spanish if needed), then a 7-day monitored launch.

## What the client provides
Business hours, services + price rules, service area, FAQ answers, emergency policy and on-call number, calendar/FSM access (or a booking link), owner alert phone/email, greeting tone/voice choice, call-forwarding setup on their phone line, and texting registration info (legal name, EIN, address).

## Pricing note
Priced like every service: $500 flat + $99/mo retainer — but per-minute voice costs may exceed $99/mo for busy shops. Decide on a minute cap or a separate tier before selling (open question).

## Customer-facing wording (aligned to Annie's ink)
Say "Automations" / outcome language ("the 9pm call gets caught and booked"). No tool brands (no Vapi/Retell/n8n/Twilio) in customer talk. If asked "Is this AI?": "It's a shop-floor Lead Recovery install. You keep the keys."
