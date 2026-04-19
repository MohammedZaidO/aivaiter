"use client";

import { useState, useRef, useEffect } from "react";
import { Send, UtensilsCrossed, X, MessageSquare, ChevronRight, Mic, Volume2, VolumeX } from "lucide-react";
import { restaurantConfig } from "@/data/restaurant";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  id: string;
  role: "user" | "bot";
  content: string;
  lang?: string;
};

const QUICK_CHIPS = [
  "Reserve a Table",
  "Timings",
  "Address",
  "Veg Options",
  "Party Booking",
  "Contact"
];

const REQUIRED_SLOTS = ["date", "time", "guests", "name", "phone", "specialRequest"];

function extractSlots(text: string, currentData: Record<string, string>) {
  const newData = { ...currentData };
  const lText = text.toLowerCase().trim();

  // Guests
  let guestMatch = text.match(/\b(\d+)\s+(people|guests|pax)\b/i);
  if (guestMatch) newData.guests = guestMatch[1];
  else {
    guestMatch = text.match(/\b(?:for|party of|table for)\s+(\d+)\b/i);
    if (guestMatch) newData.guests = guestMatch[1];
    else if (!newData.guests && /^\d+$/.test(lText)) {
      newData.guests = lText;
    }
  }

  // Time
  let timeMatch = text.match(/\b([0-2]?[0-9](?::[0-5][0-9])?\s*(?:am|pm|a\.m\.|p\.m\.))\b/i);
  if (timeMatch) newData.time = timeMatch[1];
  else {
    timeMatch = text.match(/\bat\s+([0-2]?[0-9](?::[0-5][0-9])?)\b/i);
    if (timeMatch) newData.time = timeMatch[1];
    else if (!newData.time && /^(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)$/i.test(lText)) {
      newData.time = lText;
    }
  }

  // Date
  const dateMatch = text.match(/\b(today|tomorrow|tonight|(?:next\s+)?(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)|\d{1,2}(?:st|nd|rd|th)?\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*)\b/i);
  if (dateMatch) newData.date = dateMatch[1];
  else if (!newData.date && /^(monday|tuesday|wednesday|thursday|friday|saturday|sunday)$/i.test(lText)) {
    newData.date = lText;
  }

  // Phone
  const phoneMatch = text.match(/\b(\+?\d{1,3}[ -]?\d{3,4}[ -]?\d{4})\b/) || text.match(/\b(\d{10})\b/);
  if (phoneMatch) newData.phone = phoneMatch[1] || phoneMatch[2];
  else if (!newData.phone && /^(\d{9,12})$/.test(lText)) {
    newData.phone = lText;
  }

  // Name
  const nameMatch = text.match(/\b(?:under the name|my name is|name is|call me)\s+([a-zA-Z\s]+)\b/i);
  if (nameMatch) newData.name = nameMatch[1].trim();

  // Special request
  if (lText.includes("no special request") || lText === "none" || lText === "no" || lText === "nothing") {
    newData.specialRequest = "None";
  }

  return newData;
}

export default function ChatWidget() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "bot",
      content: `Welcome to ${restaurantConfig.name}! How can I assist you with reservations, timings, or our menu today?`,
      lang: "en"
    },
  ]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Booking Flow State
  const [isBookingMode, setIsBookingMode] = useState(false);
  const [bookingData, setBookingData] = useState<Record<string, string>>({});
  const [askingField, setAskingField] = useState<string | null>(null);

  // Voice States
  const [recModalOpen, setRecModalOpen] = useState(false);
  const [recLang, setRecLang] = useState("en-IN");
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const addMessage = (role: "user" | "bot", content: string, lang = "en") => {
    setMessages((prev) => [...prev, { id: Date.now().toString() + Math.random(), role, content, lang }]);
  };

  const handleTTS = (msgIndex: number, text: string, lang?: string) => {
    if (playingIndex === msgIndex) {
      window.speechSynthesis.cancel();
      setPlayingIndex(null);
      return;
    }
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    let langCode = "en-IN";
    if (lang === "hi" || lang === "hi_latn") langCode = "hi-IN";
    else if (lang === "te") langCode = "te-IN";
    
    utterance.lang = langCode;
    utterance.onend = () => setPlayingIndex(null);
    utterance.onerror = () => setPlayingIndex(null);
    
    setPlayingIndex(msgIndex);
    window.speechSynthesis.speak(utterance);
  };

  const startBrowserSTT = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      alert("Browser speech recognition not supported. Try Chrome or Edge.");
      return;
    }
    const rec = new SR();
    rec.lang = recLang;
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    rec.onresult = (ev: any) => {
      const transcript = ev.results?.[0]?.[0]?.transcript || "";
      if (transcript) setInput((prev) => (prev ? prev + " " : "") + transcript);
    };
    rec.onerror = (ev: any) => {
      console.error("STT Error:", ev.error);
    };

    try {
      rec.start();
      setRecModalOpen(false);
    } catch (e: any) {
      alert("Could not start microphone. " + e.message);
    }
  };

  const processBookingStep = async (userMessage: string, currentData: Record<string, string>) => {
    let updatedData = extractSlots(userMessage, currentData);

    if (askingField && !updatedData[askingField]) {
      if (askingField === "name" || askingField === "specialRequest") {
         updatedData[askingField] = userMessage;
      } else if (askingField === "guests" && /^\d+$/.test(userMessage.trim())) {
         updatedData.guests = userMessage.trim();
      } else if (!updatedData[askingField]) {
         updatedData[askingField] = userMessage; 
      }
    }

    setBookingData(updatedData);

    const missing = REQUIRED_SLOTS.find(slot => !updatedData[slot]);
    
    if (missing) {
        setAskingField(missing);
        let botReply = "";
        switch (missing) {
            case "date": botReply = "For what date would you like to request the table?"; break;
            case "time": botReply = "What time should we expect you?"; break;
            case "guests": botReply = "How many guests will be joining?"; break;
            case "name": botReply = "Under what name should we hold the reservation request?"; break;
            case "phone": botReply = "What's the best phone number to reach you at?"; break;
            case "specialRequest": botReply = "Any special requests? (allergies, occasions). You can just say 'none'."; break;
        }
        
        setTimeout(() => {
          addMessage("bot", botReply, "en");
        }, 400);

    } else {
        setIsBookingMode(false);
        setAskingField(null);
        setBookingData({});
        
        try {
          await fetch("/api/booking", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...updatedData, source: "AIVaiter Demo Widget" }),
          });
        } catch (e) {
          console.error("Failed to submit booking lead");
        }

        setTimeout(() => {
          addMessage("bot", `Thanks, ${updatedData.name}! Your reservation request for ${updatedData.guests} guests on ${updatedData.date} at ${updatedData.time} has been safely recorded. Our team will contact you shortly to confirm.`, "en");
        }, 400);
    }
  };

  const handleSend = async (e?: React.FormEvent, directMessage?: string) => {
    if (e) e.preventDefault();
    
    const userMessage = (directMessage || input).trim();
    if (!userMessage) return;

    setInput("");
    addMessage("user", userMessage);
    setIsLoading(true);

    try {
      if (isBookingMode) {
        await processBookingStep(userMessage, bookingData);
      } else {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMessage }),
        });

        const data = await response.json();
        addMessage("bot", data.reply, data.lang);
        
        if (data.triggerBooking) {
          setIsBookingMode(true);
          setTimeout(async () => {
             await processBookingStep(userMessage, {});
          }, 500);
        }
      }
    } catch (error) {
      console.error(error);
      addMessage("bot", "I'm having trouble connecting right now. Please call us at " + restaurantConfig.contactPhone);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-[350px] sm:w-[400px] h-[580px] max-h-[85vh] flex flex-col bg-surface-high border border-[rgba(212,175,55,0.15)] rounded-2xl shadow-2xl ambient-shadow overflow-hidden z-40 flex-shrink-0"
          >
            {/* Header */}
            <div className="bg-surface-highest p-4 flex items-center justify-between border-b border-[rgba(212,175,55,0.1)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-tr from-[var(--gold-primary)] to-[var(--gold-light)]">
                  <UtensilsCrossed className="w-5 h-5 text-[#121212]" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-foreground leading-tight">AIVaiter</h3>
                  <p className="text-xs text-[var(--gold-primary)] opacity-80">{restaurantConfig.name} Concierge</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-surface-low rounded-full transition-colors text-foreground/70"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`relative max-w-[85%] rounded-2xl px-4 py-3 text-sm flex flex-col gap-2 ${
                      msg.role === "user"
                        ? "bg-surface-low border border-[rgba(212,175,55,0.2)] text-foreground"
                        : "bg-gradient-to-br from-[#1c1b1b] to-[#252424] border border-transparent shadow-md text-foreground/90 leading-relaxed pr-10"
                    }`}
                  >
                    {msg.role === "bot" && (
                      <button
                        onClick={() => handleTTS(index, msg.content, msg.lang)}
                        className={`absolute top-2 right-2 p-1.5 rounded-full transition-colors 
                          ${playingIndex === index ? "text-[var(--gold-primary)] bg-[var(--gold-primary)]/10" : "text-foreground/40 hover:text-foreground/80 hover:bg-surface-high"}
                        `}
                      >
                        {playingIndex === index ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                    )}
                    {msg.content}
                  </div>
                </div>
              ))}
              
              {/* Quick Action Chips */}
              {messages[messages.length - 1]?.role === "bot" && !isBookingMode && !isLoading && (
                <div className="flex flex-wrap gap-2 justify-start pt-2">
                   {QUICK_CHIPS.map((chip, idx) => (
                      <button 
                        key={idx}
                        onClick={() => handleSend(undefined, chip)}
                        className="px-3 py-1.5 text-xs rounded-full bg-surface border border-surface-highest text-foreground/80 hover:text-[var(--gold-primary)] hover:border-[var(--gold-primary)]/30 transition-colors flex items-center gap-1"
                      >
                         {chip} <ChevronRight className="w-3 h-3" />
                      </button>
                   ))}
                </div>
              )}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-surface-low rounded-2xl px-4 py-3 text-sm flex gap-1 items-center h-10">
                    <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1.5 h-1.5 bg-foreground/50 rounded-full" />
                    <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-foreground/50 rounded-full" />
                    <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-foreground/50 rounded-full" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Language Overlay for STT */}
            <AnimatePresence>
              {recModalOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-[72px] left-4 right-4 bg-surface-high border border-[var(--gold-primary)]/20 p-4 rounded-xl shadow-xl z-50 flex flex-col gap-3"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium text-foreground">Voice Language</h4>
                    <button onClick={() => setRecModalOpen(false)} className="text-foreground/50 hover:text-foreground"><X className="w-4 h-4"/></button>
                  </div>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" value="en-IN" checked={recLang === "en-IN"} onChange={(e) => setRecLang(e.target.value)} className="accent-[var(--gold-primary)]"/> English
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" value="hi-IN" checked={recLang === "hi-IN"} onChange={(e) => setRecLang(e.target.value)} className="accent-[var(--gold-primary)]"/> Hindi
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" value="te-IN" checked={recLang === "te-IN"} onChange={(e) => setRecLang(e.target.value)} className="accent-[var(--gold-primary)]"/> Telugu
                    </label>
                  </div>
                  <button onClick={startBrowserSTT} className="mt-1 w-full bg-[var(--gold-primary)] text-[#121212] py-2 rounded-lg text-sm font-medium hover:bg-[var(--gold-light)] transition-colors">Start Recording</button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input Area */}
            <div className="p-4 bg-surface-highest border-t border-[rgba(212,175,55,0.1)]">
              <form onSubmit={handleSend} className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type or speak a message..."
                  className="w-full bg-surface-high border border-surface-low rounded-full px-4 py-3 pr-[5rem] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--gold-primary)] text-foreground placeholder:text-foreground/40 transition-all font-sans"
                />
                <button
                  type="button"
                  onClick={() => setRecModalOpen(true)}
                  className="absolute right-10 p-2 text-foreground/50 hover:text-[var(--gold-primary)] transition-colors"
                  title="Voice Input"
                >
                  <Mic className="w-4 h-4" />
                </button>
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 p-2 bg-[var(--gold-primary)] text-[#121212] rounded-full disabled:opacity-50 disabled:bg-surface-low disabled:text-foreground/50 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-tr from-[var(--gold-primary)] to-[var(--gold-light)] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-105 transition-transform z-50"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-[#121212]" />
        ) : (
          <MessageSquare className="w-6 h-6 text-[#121212]" />
        )}
      </button>
    </>
  );
}
