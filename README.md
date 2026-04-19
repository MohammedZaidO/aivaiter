# AIVaiter - Restaurant AI Receptionist (Demo)

A premium, production-ready demo website to showcase **AIVaiter** to potential restaurant clients.

## Features
- **Gilded Noir UI**: Deep charcoal with warm gold accents for a luxury hospitality feel.
- **Multilingual AI Concierge**: Built-in regex language detection automatically routes Hindi, Telugu, Roman-Hindi, and English queries.
- **Speech-to-Text (STT)**: Browser-based microphone dictation with an elegant inline language selector.
- **Text-to-Speech (TTS)**: Instant voice playback for bot responses using lightweight browser APIs.
- **Smart Booking Flow**: Dynamically extracts partial dates/times from chat and only asks for missing fields. 
- **Domain Guardrails**: Strict prompt injections prevent the AI from discussing non-restaurant topics.

## Setup Instructions

**1. Install**
```bash
npm install
```

**2. Configure Environment**
```bash
cp .env.example .env.local
```
Inside `.env.local`:
- `OPENAI_API_KEY`: *(Optional)* Add your key to enable the GPT fallback for questions outside of hardcoded FAQs.
- `GOOGLE_SHEET_WEBHOOK_URL`: *(Optional)* Add a Make.com or Zapier Webhook URL here. Captures reservation leads mapped to `src/app/api/booking/route.ts`.

**3. Run Demo**
```bash
npm run dev
```

## Customizing for a Client Pitch
Open `src/data/restaurant.ts`. You can change the `restaurantConfig` object to mock AIVaiter for a specific target client before showing them the demo. Adjusting the timings, cuisines, or phone numbers will automatically reflect in the AI bot's scripted answers.
