import { NextResponse } from "next/server";
import { chatbotFaqs, restaurantConfig } from "@/data/restaurant";

const DEVANAGARI_RE = /[\u0900-\u097F]/;
const TELUGU_RE     = /[\u0C00-\u0C7F]/;
const ROMAN_HINTS = [
  "kaise","kese","karu","kro","karo","mein","ke liye","hai","kya","chahiye",
  "batao","dikhao","khaana","book","karna","madad","samay","kahan"
];

function detectLangFromTextStrict(t: string) {
  if (TELUGU_RE.test(t)) return "te";
  if (DEVANAGARI_RE.test(t)) return "hi";
  const low = (t || "").toLowerCase();
  const hasRoman = ROMAN_HINTS.some(h => low.includes(h));
  return hasRoman ? "hi_latn" : "en";
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const lMessage = message.toLowerCase();
    const lang = detectLangFromTextStrict(message);

    // 1. Check for booking intents
    const bookingKeywords = ["book", "reserve", "reservation", "table", "party", "booking", "book karna", "reserve cheyali"];
    const isBookingIntent = bookingKeywords.some((word) => lMessage.includes(word));

    if (isBookingIntent) {
      return NextResponse.json({
        reply: "I can help you place a reservation request. / मैं आपकी बुकिंग में मदद कर सकता हूँ।",
        triggerBooking: true, // Frontend handles language per slot filling directly
        lang
      });
    }

    // 2. Check for matching FAQs
    let bestMatch = null;
    let maxMatches = 0;

    for (const faq of chatbotFaqs) {
      let matches = 0;
      for (const keyword of faq.keywords) {
        if (lMessage.includes(keyword)) {
          matches++;
        }
      }
      if (matches > maxMatches) {
        maxMatches = matches;
        bestMatch = faq;
      }
    }

    if (bestMatch && maxMatches > 0) {
      if (bestMatch.triggerBooking) {
        return NextResponse.json({
          reply: bestMatch.answer,
          triggerBooking: true,
          lang
        });
      }
      return NextResponse.json({ reply: bestMatch.answer, lang });
    }

    // 3. Fallback to OpenAI (if configured)
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      try {
        let langInstruction = "Write the answer in English.";
        if (lang === "hi") langInstruction = "उत्तर हिन्दी (देवनागरी) में लिखें।";
        if (lang === "te") langInstruction = "సమాధానం తెలుగులో రాయండి.";
        if (lang === "hi_latn") langInstruction = "Write the answer in Roman Hindi (Hindi in English letters). Avoid Devanagari.";

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: `You are AIVaiter, the friendly and polite digital concierge for ${restaurantConfig.name} in ${restaurantConfig.city}. 
Restaurant details: timings ${restaurantConfig.timings}, cuisines ${restaurantConfig.cuisine}.
You ONLY answer questions related to the restaurant, dining, food, or making reservations. 
If the user asks an out-of-domain question (e.g. history, politics, general chat, movies), you MUST reply exactly: 
"I’m here to help with restaurant questions and reservations for ${restaurantConfig.name}. Please ask about bookings, timings, menu, location, or dining-related queries."
Keep your answers brief, polite, and never exceed 3 sentences.
${langInstruction}`
              },
              { role: "user", content: message },
            ],
            temperature: 0.2,
          }),
        });

        const data = await response.json();
        if (data.choices && data.choices[0] && data.choices[0].message) {
          return NextResponse.json({ reply: data.choices[0].message.content });
        }
      } catch (err) {
        console.error("OpenAI Fallback Error:", err);
      }
    }

    // 4. Ultimate Fallback (if no OpenAI or error)
    return NextResponse.json({
      reply: `I’m not entirely sure, but our team at ${restaurantConfig.name} would be happy to help. You can call us at ${restaurantConfig.contactPhone}.`,
    });

  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ reply: "Sorry, an error occurred. Please try again." }, { status: 500 });
  }
}
