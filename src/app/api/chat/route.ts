import { NextResponse } from "next/server";
import { chatbotFaqs, restaurantConfig } from "@/data/restaurant";

/* ──────────────────── Language Detection ──────────────────── */
const DEVANAGARI_RE = /[\u0900-\u097F]/;
const ROMAN_HINTS = [
  "kaise","kese","karu","kro","karo","mein","ke liye","hai","kya","chahiye",
  "batao","dikhao","khaana","karna","madad","samay","kahan","hum","chahte"
];

function detectLangFromText(t: string) {
  if (DEVANAGARI_RE.test(t)) return "hi";
  const low = (t || "").toLowerCase();
  if (ROMAN_HINTS.some(h => low.includes(h))) return "hi_latn";
  return "en";
}

/* ──────────────────── Intent Classification ──────────────────── */
type Intent =
  | "reservation"
  | "group_discount"
  | "preorder"
  | "callback"
  | "menu"
  | "small_talk"
  | "follow_up"
  | "out_of_domain"
  | "unknown";

function classifyIntent(msg: string): Intent {
  const m = msg.toLowerCase();

  // Out-of-domain — check first to prevent false-positive routing
  const outOfDomainWords = [
    "gandhi","politics","cricket","movie","song","weather","stock","bitcoin",
    "exam","study","hospital","medicine","airport","hotel room","news"
  ];
  if (outOfDomainWords.some(w => m.includes(w))) return "out_of_domain";

  // Callback / contact requests
  const callbackWords = ["call me","callback","call back","contact me","reach me",
    "get in touch","speak to someone","talk to staff","human","manager"];
  if (callbackWords.some(w => m.includes(w))) return "callback";

  // Group / discount / pricing enquiry — MUST come before generic reservation check
  // Key signal: discount / pricing + seats / people / group
  const discountSignals = ["discount","offer","deal","pricing","rate","concession","negotiat"];
  const groupSignals = ["20 seat","30 seat","50 seat","large group","bulk","corporate",
    "event booking","catering","office party","company","conference"];
  const hasDiscount = discountSignals.some(w => m.includes(w));
  const hasGroup = groupSignals.some(w => m.includes(w));
  // If they mention seats/people AND discount topics → group enquiry, NOT reservation flow
  if (hasDiscount || hasGroup) return "group_discount";

  // Pre-order / celebration / special request
  const preorderWords = [
    "cake","birthday cake","anniversary","pre-order","preorder","dessert",
    "custom writing","decoration","celebrate","balloon","flower","surprise",
    "custom message","write on cake","happy birthday","congratulation"
  ];
  if (preorderWords.some(w => m.includes(w))) return "preorder";

  const words = m.split(/\s+/);

  // Reservation intent — check early but with strict word matching
  const reserveWords = [
    "book","reserve","reservation","table","seat","booking","slot",
    "book karna","reserve cheyali","टेबल","बुक","रिज़र्व"
  ];
  if (reserveWords.some(w => words.includes(w) || (w.length > 5 && m.includes(w) && !m.includes("vegetable")))) {
     // If it's just 'table' inside 'vegetable', it's NOT a reservation
     const isVegOnly = m.includes("vegetable") && !m.includes("book") && !m.includes("reserve") && !m.includes("seat");
     if (!isVegOnly) return "reservation";
  }

  // Menu categories — Use word-based matching to avoid 'reserve' matching 'serve'
  const menuWords = ["menu","food","serve","dish","eat","starters","appetizer","kebab","main course","curry","biryani","rice","dessert","sweet","drink","beverage","water","tea","coffee","chicken","lamb","mutton","paneer","veg","non-veg","non veg","signature","special"];
  if (menuWords.some(w => words.includes(w) || (w.length > 5 && m.includes(w)))) {
    return "menu";
  }

  // Small talk / polite closure
  const smallTalkWords = ["thanks", "thank you", "ok", "okay", "fine", "cool", "great", "awesome", "dhanyawad", "shukriya"];
  if (smallTalkWords.some(w => words.includes(w))) return "small_talk";

  // Follow-ups (yes/no/more)
  const followUpWords = ["yes", "yeah", "sure", "ha", "haan", "no", "nah", "nahi", "more", "dikhao", "dikhao pure"];
  if (followUpWords.some(w => m.toLowerCase().trim() === w)) return "follow_up";

  return "unknown";
}

/* ──────────────────── Intent Replies ──────────────────── */
function getIntentReply(intent: Intent, lang: string, message: string): { reply: string; intent?: string; triggerBooking?: boolean; triggerPreorder?: boolean; triggerGroup?: boolean } | null {
  const isHindi = lang === "hi" || lang === "hi_latn";

  switch (intent) {
    case "group_discount":
      return {
        reply: isHindi
          ? "बड़े ग्रुप बुकिंग, कस्टम प्राइसिंग, और स्पेशल ऑफर के लिए हमारी टीम आपकी सीधे मदद कर सकती है। मैं आपका ग्रुप पूछताछ फ़ॉर्म खोल रहा हूँ..."
          : "For large group bookings, custom pricing, or special offers, our events team can assist you directly. Let me open the group enquiry assistant for you...",
        triggerGroup: true,
      };

    case "preorder":
      return {
        reply: isHindi
          ? "बिल्कुल! हम केक, कस्टम डेज़र्ट, और सेलिब्रेशन सेटअप के प्री-ऑर्डर लेते हैं। मैं आपका प्री-ऑर्डर रिक्वेस्ट दर्ज करता हूँ..."
          : "Absolutely! We accept pre-orders for cakes, custom desserts, and celebration setups. Let me open the pre-order request form for you...",
        triggerPreorder: true,
      };

    case "callback":
      return {
        reply: isHindi
          ? "बिल्कुल! मैं आपका कॉलबैक रिक्वेस्ट दर्ज कर देता हूँ। हमारी टीम जल्द ही संपर्क करेगी। आप सीधे " + restaurantConfig.contactPhone + " पर भी कॉल कर सकते हैं।"
          : "Of course! I'll note your callback request. Our team will reach out to you shortly. You can also call us directly at " + restaurantConfig.contactPhone + ".",
      };

    case "menu": {
      const lMsg = message.toLowerCase();
      const isFull = lMsg.includes("full") || lMsg.includes("all") || lMsg.includes("complete") || lMsg.includes("pure");
      const isSignature = lMsg.includes("signature") || lMsg.includes("special") || lMsg.includes("best") || lMsg.includes("famous") || lMsg.includes("must");
      const isVeg = lMsg.includes("veg") && !lMsg.includes("non");
      const isNonVeg = lMsg.includes("non-veg") || lMsg.includes("non veg") || lMsg.includes("meat") || lMsg.includes("chicken") || lMsg.includes("lamb");
      const isBiryani = lMsg.includes("biryani") || lMsg.includes("rice");
      const isDessert = lMsg.includes("dessert") || lMsg.includes("sweet") || lMsg.includes("meetha");
      const isStarter = lMsg.includes("starter") || lMsg.includes("appetizer") || lMsg.includes("kebab");
      const isDrink = lMsg.includes("drink") || lMsg.includes("beverage") || lMsg.includes("lassi") || lMsg.includes("chai");

      if (isFull) {
        const fullMenuText = restaurantConfig.fullMenu.map(cat => 
          `### ${cat.category.toUpperCase()}\n` + cat.items.map(i => `• ${i.name} (${i.price})`).join("\n")
        ).join("\n\n");
        return {
          reply: isHindi 
            ? `यहाँ हमारा पूरा मेनू है:\n\n${fullMenuText}\n\nक्या मैं आपकी बुकिंग में मदद करूँ?`
            : `Here is our complete menu:\n\n${fullMenuText}\n\nShall I help you with a booking?`,
          intent: "menu_full"
        };
      }

      let targetCategory = "";
      if (isBiryani) targetCategory = "Biryani & Rice";
      else if (isDessert) targetCategory = "Desserts";
      else if (isStarter) targetCategory = "Starters";
      else if (isDrink) targetCategory = "Beverages";
      else if (isSignature) targetCategory = "Signature Dishes";
      else if (isVeg || isNonVeg) targetCategory = "Main Course";

      if (targetCategory) {
        let items = restaurantConfig.fullMenu.find(c => c.category === targetCategory)?.items || [];
        if (isVeg) items = items.filter(i => i.isVeg);
        if (isNonVeg) items = items.filter(i => i.isNonVeg);

        if (items.length > 0) {
          const menuText = items.map(i => `• ${i.name} (${i.price})\n  ${i.desc}`).join("\n\n");
          return {
            reply: isHindi 
              ? `### ${targetCategory.toUpperCase()}\n\n${menuText}\n\nक्या आप पूरा मेनू देखना चाहेंगे?`
              : `### ${targetCategory.toUpperCase()}\n\n${menuText}\n\nWould you like to see the full menu?`,
            intent: "menu_prompt"
          };
        }
      }

      // Default Menu Summary
      const summary = restaurantConfig.fullMenu.map(c => `• ${c.category}`).join("\n");
      return {
        reply: isHindi
          ? `हमारे मेनू में मुख्य रूप से ये श्रेणियां हैं:\n${summary}\n\nआप किसी विशेष श्रेणी के बारे में पूछ सकते हैं या "पूरा मेनू" देख सकते हैं। मैं आपकी और क्या मदद करूँ?`
          : `We have a wide range covering starters, main course, and desserts. Our categories include:\n${summary}\n\nYou can ask about a specific category or simply say "Full Menu". What sounds good to you?`,
        intent: "menu_summary"
      };
    }

    case "small_talk": {
      const lMsg = message.toLowerCase();
      
      // Suggestion handling
      if (lMsg.includes("suggest") || lMsg.includes("recommend") || lMsg.includes("special") || lMsg.includes("famous")) {
        const items = restaurantConfig.fullMenu.find(c => c.category === "Signature Dishes")?.items || [];
        const itemNames = items.slice(0, 3).map(i => i.name).join(", ");
        return {
          reply: isHindi
            ? `हमारे यहाँ के ${itemNames} बहुत प्रसिद्ध हैं। क्या आप इनके बारे में और जानना चाहेंगे?`
            : `I highly recommend our signature dishes, especially the ${itemNames}. Would you like to see our full signature menu?`,
          intent: "menu_prompt"
        };
      }

      // Greetings / How are you
      if (lMsg.includes("how are you") || lMsg.includes("how r u") || lMsg.includes("kaisa h") || lMsg.includes("kaise ho")) {
        return {
          reply: isHindi
            ? "मैं बहुत अच्छा हूँ, धन्यवाद! मैं " + restaurantConfig.name + " के लिए आपका डिजिटल असिस्टेंट हूँ। मैं बुकिंग या मेनू में आपकी मदद कर सकता हूँ।"
            : "I'm doing great, thank you for asking! I'm your digital concierge for " + restaurantConfig.name + ". I can help you with reservations, menu suggestions, or general enquiries.",
          intent: "small_talk"
        };
      }

      if (lMsg.includes("thanks") || lMsg.includes("thank you") || lMsg.includes("dhanyawad") || lMsg.includes("shukriya")) {
        return {
          reply: isHindi
            ? "मेरा सौभाग्य! क्या मैं आपकी बुकिंग या मेनू के साथ और मदद कर सकता हूँ?"
            : "It's my pleasure to assist you! Would you like to look at the menu or should we proceed with a table booking?",
          intent: "polite_closure"
        };
      }
      
      return {
        reply: isHindi
          ? "नमस्ते! मैं आपके लिए क्या कर सकता हूँ? आप टेबल बुकिंग, हमारे मेनू या खास इवेंट्स के बारे में पूछ सकते हैं।"
          : "Hello! I'm here to ensure your experience with " + restaurantConfig.name + " is seamless. How can I help you today?",
        intent: "small_talk"
      };
    }

    case "follow_up":
      return null; // Will be handled in main POST with lastIntent context

    case "out_of_domain":
      return {
        reply: isHindi
          ? "मैं केवल " + restaurantConfig.name + " के बारे में सवालों में मदद कर सकता हूँ — बुकिंग, मेनू, टाइमिंग या डाइनिंग से जुड़े सवाल पूछें।"
          : "I'm here to help with questions about " + restaurantConfig.name + " — bookings, menu, timings, and dining. For anything else, I'm afraid I can't assist.",
      };

    default:
      return null;
  }
}

/* ──────────────────── Main Handler ──────────────────── */
export async function POST(req: Request) {
  try {
    const { message, lang: sessionLang, lastIntent } = await req.json();
    const lMessage = message.toLowerCase().trim();
    const lang = sessionLang || detectLangFromText(message);
    const isHindi = lang === "hi" || lang === "hi_latn";

    // 1. Context-aware follow-up handling
    const AffirmativeWords = ["yes", "ha", "haan", "sure", "yeah", "ok", "okay", "ji", "bilkul"];
    if (AffirmativeWords.includes(lMessage)) {
      // If user says 'yes' after a menu prompt
      if (lastIntent === "menu_prompt" || lastIntent === "menu_summary") {
        const fullMenuText = restaurantConfig.fullMenu.map(cat => 
          `### ${cat.category.toUpperCase()}\n` + cat.items.map(i => `• ${i.name} (${i.price})`).join("\n")
        ).join("\n\n");
        return NextResponse.json({
          reply: isHindi 
            ? `जी बिलकुल, यहाँ हमारा पूरा मेनू है:\n\n${fullMenuText}\n\nक्या मैं आपकी बुकिंग में मदद करूँ?`
            : `Certainly, here is our full menu:\n\n${fullMenuText}\n\nShall I help you with a booking?`,
          lang,
          intent: "menu_full"
        });
      }
      
      // If user says 'yes' after seeing the full menu or polite closure
      if (lastIntent === "menu_full" || lastIntent === "polite_closure" || lastIntent === "small_talk") {
        return NextResponse.json({
          reply: isHindi
            ? "ज़रूर! मैं आपका रिज़र्वेशन असिस्टेंस खोल रहा हूँ..."
            : "Wonderful! I'm opening the booking assistant for you...",
          triggerBooking: true,
          lang,
          intent: "reservation"
        });
      }
    }

    const NegativeWords = ["no", "nah", "nahi", "not now", "later"];
    if (NegativeWords.some(w => lMessage === w)) {
      return NextResponse.json({
        reply: isHindi
          ? "कोई बात नहीं! अगर आपको बाद में किसी और चीज़ की ज़रूरत हो, तो बस पूछ लें। आपका दिन शुभ हो!"
          : "No problem at all! If you need anything else later, just let me know. Have a wonderful day!",
        lang,
        intent: "closure"
      });
    }

    // 2. Classify intent
    const intent = classifyIntent(message);

    // 3. Handle non-reservation intents
    const intentReply = getIntentReply(intent, lang, lMessage);
    if (intentReply) {
      return NextResponse.json({ ...intentReply, lang });
    }

    // 3. Handle reservation intent
    if (intent === "reservation") {
      const isHindi = lang === "hi" || lang === "hi_latn";
      return NextResponse.json({
        reply: isHindi
          ? "मैं आपका रिज़र्वेशन अनुरोध दर्ज करने में मदद करूँगा। बुकिंग असिस्टेंट खोल रहा हूँ..."
          : "I'd be happy to help you place a reservation request. Opening the booking assistant...",
        triggerBooking: true,
        lang,
      });
    }

    // 4. Check FAQs for "unknown" or unmatched intents
    let bestMatch: typeof chatbotFaqs[0] | null = null;
    let maxMatches = 0;
    for (const faq of chatbotFaqs) {
      let matches = 0;
      for (const keyword of faq.keywords) {
        if (lMessage.includes(keyword)) matches++;
      }
      if (matches > maxMatches) { maxMatches = matches; bestMatch = faq; }
    }

    if (bestMatch && maxMatches > 0) {
      if (bestMatch.triggerBooking) {
        return NextResponse.json({ reply: bestMatch.answer, triggerBooking: true, lang });
      }
      return NextResponse.json({ reply: bestMatch.answer, lang });
    }

    // 5. OpenAI fallback
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      try {
        let langInstruction = "Write the answer in English only. Keep it under 3 sentences.";
        if (lang === "hi") langInstruction = "उत्तर हिन्दी (देवनागरी) में लिखें। 3 वाक्य से ज़्यादा नहीं।";
        if (lang === "hi_latn") langInstruction = "Write the answer in Roman Hindi. Keep under 3 sentences.";

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: `You are AIVaiter, the polite AI concierge for ${restaurantConfig.name} in ${restaurantConfig.city}.
Timings: ${restaurantConfig.timings}. Cuisines: ${restaurantConfig.cuisine}.
ONLY answer restaurant-related questions. For anything off-topic reply: "I'm here to help with ${restaurantConfig.name} — bookings, menu, timings, and dining enquiries."
${langInstruction}`,
              },
              { role: "user", content: message },
            ],
            temperature: 0.2,
          }),
        });
        const data = await response.json();
        if (data.choices?.[0]?.message) {
          return NextResponse.json({ reply: data.choices[0].message.content, lang });
        }
      } catch (err) {
        console.error("OpenAI Error:", err);
      }
    }

    // 6. Ultimate fallback
    return NextResponse.json({
      reply: `I'm not sure about that, but our team at ${restaurantConfig.name} would be happy to help. Call us at ${restaurantConfig.contactPhone}.`,
      lang,
    });

  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ reply: "Sorry, something went wrong. Please try again." }, { status: 500 });
  }
}
