import { NextResponse } from "next/server";
import { chatbotFaqs, restaurantConfig } from "@/data/restaurant";

/* ──────────────────── Language Detection ──────────────────── */
const DEVANAGARI_RE = /[\u0900-\u097F]/;
const URDU_RE = /[\u0600-\u06FF]/;
const ROMAN_HINTS = [
  "kaise","kese","karu","kro","karo","mein","ke liye","hai","kya","chahiye",
  "batao","dikhao","khaana","karna","madad","samay","kahan","hum","chahte"
];

function detectLangFromText(t: string) {
  if (URDU_RE.test(t)) return "ur";
  if (DEVANAGARI_RE.test(t)) return "hi";
  const low = (t || "").toLowerCase();
  if (ROMAN_HINTS.some(h => low.includes(h))) return "hi_latn";
  return "en";
}

/* ──────────────────── Types & State ──────────────────── */
type Journey = "reservation" | "preorder" | "table_order" | "general" | null;

interface ChatSession {
  journey: Journey;
  booking: {
    date: string;
    time: string;
    guests: number | null;
    specialRequest: string;
  };
  cart: { id: string; name: string; quantity: number }[];
  tableId: string | null;
  bookingConfirmed?: boolean;
}

/* ──────────────────── OpenAI Integration ──────────────────── */
async function processWithOpenAI(message: string, session: ChatSession, lang: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  let langInstruction = "Respond in English.";
  if (lang === "hi") langInstruction = "Respond in Hindi (Devanagari script).";
  if (lang === "hi_latn") langInstruction = "Respond in Roman Hindi / Hinglish.";
  if (lang === "ur") langInstruction = "Respond in Urdu (Nastaliq script).";

  // Build the system prompt
  let contextStr = `Current Journey: ${session.journey || "general"}\n`;
  if (session.tableId) contextStr += `Table Mode: Active (Table ${session.tableId})\n`;
  if (session.booking.date || session.booking.time || session.booking.guests) {
    contextStr += `Booking Context: ${JSON.stringify(session.booking)}\n`;
  }
  if (session.cart.length > 0) {
    contextStr += `Cart Context: ${JSON.stringify(session.cart)}\n`;
  }

  // Provide menu for ordering
  const menuStr = restaurantConfig.fullMenu.map(c => 
    `${c.category}: ` + c.items.map(i => `${i.name} (ID: ${i.id}, ${i.price})`).join(", ")
  ).join("\n");

  const systemPrompt = `You are AIVaiter, a premium AI concierge for ${restaurantConfig.name} in ${restaurantConfig.city}.
Timings: ${restaurantConfig.timings}. Cuisines: ${restaurantConfig.cuisine}.
${langInstruction}
Keep responses concise, polite, and premium (max 3 sentences).

Context:
${contextStr}

Menu (for ordering):
${menuStr}

CRITICAL RULES:
1. MEMORY: NEVER re-ask for details you already have in the Context (e.g. date, time, guests). Only ask for what is missing.
2. TABLE MODE: If 'Table Mode' is active, DO NOT ask for reservations. Focus entirely on taking direct food orders for their table or calling staff. 
3. PREORDERS: Do NOT allow or suggest preordering food UNLESS a reservation is fully confirmed (i.e., date, time, and guests are collected) OR 'Table Mode' is active.
4. SUMMARIES: When a reservation is fully collected, confirm it clearly and provide a booking reference. When cart is updated, summarize the items added and state the new total.
5. If the user provides ANY actionable data (even partial booking details like just a date, or food orders), ALWAYS call the corresponding tool immediately to save it. Do not just reply in text. For example, if they only give a date, call update_booking with the date, then ask for guests.
6. CART CONFIRMATION: If the user confirms an order (e.g. "order it", "confirm order", "done"), DO NOT call update_cart again with the items already in the cart. Only call update_cart when explicitly NEW items are requested.
7. ACCURACY: Always use the EXACT values for guests, dates, and item quantities provided in the Context. Never hallucinate different numbers.`;

  const tools = [
    {
      type: "function",
      function: {
        name: "update_booking",
        description: "Updates the current reservation details. Call this IMMEDIATELY even if the user only provides partial information (e.g. just the date or just the guests). Do NOT wait for all details.",
        parameters: {
          type: "object",
          properties: {
            date: { type: "string", description: "The date of the reservation (e.g. 'Tomorrow', 'Friday', '2023-12-01')" },
            time: { type: "string", description: "The time of the reservation (e.g. '8 PM', '20:00')" },
            guests: { type: "number", description: "Number of people" },
            specialRequest: { type: "string", description: "Any special requests or occasions" }
          }
        }
      }
    },
    {
      type: "function",
      function: {
        name: "update_cart",
        description: "Updates the food cart. Provide the TOTAL desired quantity for each item (not just the increment). If an item already exists, its quantity will be set to this new value. Do NOT call this for order confirmation; only call it for adding/changing items.",
        parameters: {
          type: "object",
          properties: {
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string", description: "The exact ID of the item from the menu (e.g. 'sig_1')" },
                  name: { type: "string", description: "The name of the item" },
                  quantity: { type: "number", description: "The quantity to add" }
                },
                required: ["id", "name", "quantity"]
              }
            }
          },
          required: ["items"]
        }
      }
    }
  ];

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        tools: tools as any,
        tool_choice: "auto",
        temperature: 0.2,
      }),
    });
    const data = await response.json();
    return data.choices?.[0]?.message;
  } catch (err) {
    console.error("OpenAI Error:", err);
    return null;
  }
}

/* ──────────────────── Main Handler ──────────────────── */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, lang: reqLang } = body;
    const session: ChatSession = body.session || {
      journey: "general",
      booking: { date: "", time: "", guests: null, specialRequest: "" },
      cart: [],
      tableId: null
    };

    const lMessage = message.toLowerCase().trim();
    const lang = reqLang || detectLangFromText(message);
    const isHindi = lang === "hi" || lang === "hi_latn";
    const isUrdu = lang === "ur";

    // 1. Try OpenAI for advanced parsing and conversational memory
    const aiMessage = await processWithOpenAI(message, session, lang);
    
    if (aiMessage) {
      let updatedSession = { ...session };
      let replyText = aiMessage.content || "";

      // Handle function calls
      if (aiMessage.tool_calls && aiMessage.tool_calls.length > 0) {
        for (const tool of aiMessage.tool_calls) {
          if (tool.function.name === "update_booking") {
            const args = JSON.parse(tool.function.arguments);
            updatedSession.journey = "reservation";
            if (args.date && args.date.trim() !== "") updatedSession.booking.date = args.date;
            if (args.time && args.time.trim() !== "") updatedSession.booking.time = args.time;
            if (args.guests) updatedSession.booking.guests = args.guests;
            if (args.specialRequest && args.specialRequest.trim() !== "") updatedSession.booking.specialRequest = args.specialRequest;
            
            // Check if booking is complete
            if (updatedSession.booking.date && updatedSession.booking.time && updatedSession.booking.guests) {
               if (!session.bookingConfirmed) {
                 updatedSession.bookingConfirmed = true;
                 const refNo = Math.floor(100000 + Math.random() * 900000);
                 replyText += (replyText ? " " : "") + (isHindi ? `आपका रिज़र्वेशन कन्फर्म हो गया है (Ref: #${refNo})। क्या आप अपनी विजिट के लिए कोई भोजन प्री-ऑर्डर करना चाहेंगे?` : isUrdu ? `آپ کی بکنگ کنفرم ہو گئی ہے (Ref: #${refNo})۔ کیا آپ کوئی کھانا پری آرڈر کرنا چاہیں گے؟` : `Your reservation for ${updatedSession.booking.guests} on ${updatedSession.booking.date} at ${updatedSession.booking.time} is confirmed (Ref: #${refNo}). Would you like to pre-order any food for your visit?`);
               }

            } else {
               replyText += (replyText ? " " : "") + (isHindi ? "मैंने विवरण नोट कर लिया है।" : isUrdu ? "میں نے تفصیلات نوٹ کر لی ہیں۔" : "I've noted that down.");
            }
          }
          if (tool.function.name === "update_cart") {
            // Guard: Preorder is only allowed if Table Mode is active OR booking has a date
            if (!session.tableId && !updatedSession.booking.date) {
               replyText = isHindi ? "प्री-ऑर्डर करने से पहले कृपया अपनी टेबल बुक करें।" : isUrdu ? "پری آرڈر کرنے سے پہلے براہ کرم اپنی ٹیبل بک کریں۔" : "Please confirm your table reservation before placing a pre-order.";
               continue;
            }

            const args = JSON.parse(tool.function.arguments);
            updatedSession.journey = session.tableId ? "table_order" : "preorder";
            
            // Merge cart
            const newCart = [...updatedSession.cart];
            let addedStr: string[] = [];
            let total = 0;
            args.items.forEach((newItem: any) => {
              const existing = newCart.find(i => i.id === newItem.id);
               if (existing) {
                  existing.quantity = newItem.quantity;
               } else {
                 newCart.push(newItem);
              }
              addedStr.push(`${newItem.quantity}x ${newItem.name}`);
            });
            updatedSession.cart = newCart;

            // Calculate new total
            newCart.forEach(item => {
               const price = restaurantConfig.fullMenu.flatMap(c => c.items).find(i => i.id === item.id)?.numericPrice || 0;
               total += price * item.quantity;
            });

            const addedText = addedStr.join(", ");
            if (session.tableId) {
               replyText = isHindi ? `मैंने आपके टेबल के लिए ${addedText} जोड़ दिया है। कुल बिल ₹${total} है। क्या कुछ और चाहिए?` : isUrdu ? `میں نے آپ کی ٹیبل کے لیے ${addedText} شامل کر دیا ہے۔ کل بل ₹${total} ہے۔ کچھ اور چاہیے؟` : `I've added ${addedText} to your table's order. Your subtotal is ₹${total}. Would you like anything else?`;
            } else {
               replyText = isHindi ? `प्री-ऑर्डर में ${addedText} जोड़ा गया। नया कुल: ₹${total}।` : isUrdu ? `پری آرڈر میں ${addedText} شامل کیا گیا۔ نیا کل: ₹${total}۔` : `Added ${addedText} to your pre-order. Your new subtotal is ₹${total}.`;
            }
          }
        }
      }

      return NextResponse.json({
        reply: replyText,
        lang,
        session: updatedSession
      });
    }

    // 2. Fallback Regex Logic (if OpenAI is not configured or fails)
    // Basic reservation trigger
    const reserveWords = ["book","reserve","reservation","table","seat","booking","बुक","रिज़र्व"];
    if (reserveWords.some(w => lMessage.includes(w))) {
      return NextResponse.json({
        reply: isHindi ? "ज़रूर, आप किस दिन और समय के लिए टेबल चाहते हैं?" : "I can help with that. What date and time are you looking for?",
        lang,
        session: { ...session, journey: "reservation" }
      });
    }

    // Basic FAQ fallback
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
      return NextResponse.json({ reply: bestMatch.answer, lang, session });
    }

    // Ultimate fallback
    return NextResponse.json({
      reply: `I'm not sure about that, but our team at ${restaurantConfig.name} would be happy to help. Call us at ${restaurantConfig.contactPhone}.`,
      lang,
      session
    });

  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ reply: "Sorry, something went wrong. Please try again." }, { status: 500 });
  }
}
