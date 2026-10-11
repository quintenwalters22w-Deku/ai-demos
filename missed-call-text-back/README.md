# Missed-Call Text-Back & Lead Follow-Up
Price: $500 + $99/mo.
- index.html: phone mockup demo (?static=1 shows all).
- missed-call-text-back.n8n.json: import into n8n; replace REPLACE_TWILIO_CRED_ID, TWILIO_FROM env, CFG blocks. Point Twilio call-status callback to /webhook/missed-call-status, SMS to /webhook/missed-call-inbound-sms, booking/close events to /webhook/missed-call-close.
Customer copy: no tool names. A2P 10DLC registration before go-live.
