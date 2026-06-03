"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send, UtensilsCrossed, X, MessageSquare, ChevronRight, ChevronLeft,
  Mic, Volume2, VolumeX, Globe, Calendar, Clock, Users, User, Phone,
  Sparkles, Check, Minus, Plus, Maximize2, Minimize2
} from "lucide-react";
import { restaurantConfig, mockAvailability, type TimeSlot } from "@/data/restaurant";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import DepositModal from "./DepositModal";

/* ─────────── Types ─────────── */
type SessionLang = "en" | "hi" | "ur";

type Message = {
  id: string;
  role: "user" | "bot";
  content: string;
  lang?: string;
};

type BookingStep = 
  | "date" | "time" | "guests" | "details" | "confirm" // Standard
  | "preorder_type" | "preorder_details" | "preorder_confirm" // Pre-order
  | "group_size" | "group_details" | "group_confirm" // Group
  | "deposit" // Payment demo
  | null;

interface BookingState {
  date: string;       
  dateLabel: string;   
  time: string;
  guests: number;
  name: string;
  phone: string;
  specialRequest: string;
  // Pre-order fields
  preorderType: string; // Cake, Dessert, Decoration
  preorderText: string; // Custom writing
}

/* ─────────── Constants ─────────── */
const LABELS: Record<SessionLang, Record<string, string>> = {
  en: {
    welcome: `Welcome to ${restaurantConfig.name}! I'm your AI concierge. How can I help you today?`,
    pickDate: "Pick a Date",
    pickTime: "Choose a Time Slot",
    pickGuests: "Number of Guests",
    yourDetails: "Your Details",
    confirm: "Confirm Reservation",
    name: "Full Name",
    phone: "Phone Number",
    special: "Special Requests (optional)",
    none: "None",
    submit: "Place Reservation Request",
    back: "Back",
    next: "Next",
    slots: "Available Slots",
    available: "Available",
    limited: "Limited",
    full: "Full",
    successPrefix: "Thank you",
    successBody: "Your reservation request has been recorded. Our team will contact you shortly to confirm.",
    changeLang: "Change Language",
    reserve: "Reserve a Table",
    timings: "Timings",
    address: "Address",
    vegOptions: "Veg Options",
    partyBooking: "Party/Events",
    contact: "Contact",
    // Pre-order labels
    preorderTitle: "Celebration Pre-order",
    preorderType: "What are we celebrating?",
    preorderDetails: "Custom Message / Writing",
    cake: "Birthday Cake",
    anniversary: "Anniversary Special",
    decoration: "Table Decoration",
    preorderSubmit: "Submit Pre-order Request",
    // Group labels
    groupTitle: "Group Enquiry (20+ Guests)",
    groupSize: "Estimated Group Size",
    groupSubmit: "Submit Group Enquiry",
    voiceMode: "Voice Mode"
  },
  hi: {
    welcome: `${restaurantConfig.name} में आपका स्वागत है! मैं आपका AI कॉन्सीयर्ज हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?`,
    pickDate: "तारीख़ चुनें",
    pickTime: "समय चुनें",
    pickGuests: "मेहमानों की संख्या",
    yourDetails: "आपकी जानकारी",
    confirm: "रिज़र्वेशन की पुष्टि करें",
    name: "पूरा नाम",
    phone: "फ़ोन नंबर",
    special: "विशेष अनुरोध (वैकल्पिक)",
    none: "कोई नहीं",
    submit: "रिजर्वेशन अनुरोध भेजें",
    back: "पीछे",
    next: "अगला",
    slots: "उपलब्ध स्लॉट",
    available: "उपलब्ध",
    limited: "सीमित",
    full: "फ़ुल",
    successPrefix: "धन्यवाद",
    successBody: "आपका रिज़र्वेशन अनुरोध दर्ज़ कर लिया गया है। हमारी टीम पुष्टि करने के लिए शीघ्र ही संपर्क करेगी।",
    changeLang: "भाषा बदलें",
    reserve: "टेबल रिज़र्व करें",
    timings: "समय",
    address: "पता",
    vegOptions: "शाकाहारी विकल्प",
    partyBooking: "पार्टी/इवेंट्स",
    contact: "संपर्क",
    // Pre-order labels
    preorderTitle: "सेलिब्रेशन प्री-ऑर्डर",
    preorderType: "क्या सेलिब्रेशन है?",
    preorderDetails: "कस्टम मैसेज / राइटिंग",
    cake: "बर्थडे केक",
    anniversary: "एनिवर्सरी स्पेशल",
    decoration: "टेबल डेकोरेशन",
    preorderSubmit: "प्री-ऑर्डर अनुरोध भेजें",
    // Group labels
    groupTitle: "ग्रुप पूछताछ (20+ मेहमान)",
    groupSize: "अनुमानित ग्रुप साइज",
    groupSubmit: "ग्रुप पूछताछ भेजें",
    voiceMode: "वॉइस मोड"
  },
  ur: {
    welcome: `${restaurantConfig.name} میں خوش آمدید! میں آپ کا ڈیجیٹل اسسٹنٹ ہوں۔ آج میں آپ کی کیا مدد کر سکتا ہوں؟`,
    pickDate: "تاریخ منتخب کریں",
    pickTime: "وقت کا انتخاب کریں",
    pickGuests: "مہمانوں کی تعداد",
    yourDetails: "آپ کی تفصیلات",
    confirm: "بکنگ کی تصدیق کریں",
    name: "پورا نام",
    phone: "فون نمبر",
    special: "کوئی خاص درخواست (اختیاری)",
    none: "کچھ نہیں",
    submit: "بکنگ کی درخواست بھیجیں",
    back: "پیچھے",
    next: "آگے",
    slots: "دستیاب وقت",
    limited: "محدود جگہ",
    full: "جگہ نہیں ہے",
    successPrefix: "شکریہ",
    successBody: "آپ کی ٹیبل بکنگ کی درخواست موصول ہو گئی ہے۔ ہماری ٹیم جلد ہی تصدیق کے لیے رابطہ کرے گی۔",
    preorderHeading: "پری آرڈر کی قسم منتخب کریں",
    cake: "کیک / ڈیزرٹ",
    decoration: "ٹیبل کی سجاوٹ",
    surprise: "سرپرائز ترتیب",
    preorderTextPlaceholder: "مثال: کیک پر 'ہیپی برتھ ڈے' لکھیں",
    groupHeading: "گروپ کا سائز منتخب کریں",
    groupTextPlaceholder: "کیا آپ کو کارپوریٹ ڈسکاؤنٹ یا بوفے کی ضرورت ہے؟",
    depositTitle: "بکنگ فیس محفوظ کریں",
    depositDesc: "آپ کی بکنگ کی تصدیق کے لیے ایک چھوٹی فیس درکار ہے۔",
    paySecurely: "محفوظ طریقے سے ادائیگی کریں",
    available: "دستیاب",
    changeLang: "زبان تبدیل کریں",
    reserve: "ٹیبل ریزرو کریں",
    timings: "اوقات",
    address: "پتہ",
    vegOptions: "سبزی خور",
    partyBooking: "پارٹی/تقریبات",
    contact: "رابطہ",
    preorderSubmit: "پری آرڈر بھیجیں",
    groupSubmit: "گروپ انکوائری بھیجیں",
    voiceMode: "وائس موڈ"
  }
};

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAY_NAMES  = ["Su","Mo","Tu","We","Th","Fr","Sa"];

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const blanks = Array.from({ length: firstDay }, () => null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  return [...blanks, ...days];
}

function isWeekend(dateStr: string): boolean {
  try {
    const d = new Date(dateStr);
    return d.getDay() === 0 || d.getDay() === 6;
  } catch { return false; }
}

function getSlots(dateStr: string): TimeSlot[] {
  return isWeekend(dateStr) ? mockAvailability.weekend : mockAvailability.default;
}

/* ─────────── Rendering Helpers ─────────── */
const FormattedMessage = ({ content }: { content: string }) => {
  // 1. Detect if it's a menu header (### Category or **CATEGORY**)
  // 2. Wrap blocks in clean containers
  // 3. Strip raw ** and _
  
  if (!content) return null;
  const lines = content.split('\n');
  
  return (
    <div className="space-y-1.5 overflow-hidden">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-2" />;
        
        // Header detection: e.g. **STARTERS** or ### Starters
        const isHeader = (trimmed.startsWith('**') && trimmed.endsWith('**')) || trimmed.startsWith('###');
        const cleanHeader = trimmed.replace(/\*\*|###/g, '').trim();

        if (isHeader) {
          return (
            <div key={i} className="font-serif text-[13px] font-bold text-[var(--gold-primary)] uppercase tracking-wider mt-2 mb-1 border-b border-[var(--gold-primary)]/10 pb-1">
              {cleanHeader}
            </div>
          );
        }

        // Bullet items: e.g. • Item or - Item
        const isBullet = trimmed.startsWith('•') || trimmed.startsWith('- ') || trimmed.startsWith('* ');
        const cleanLine = trimmed.replace(/^• |^- |^\* |\*\*|_/g, '').trim();

        if (isBullet) {
          return (
            <div key={i} className="flex gap-2 text-[13px] leading-relaxed">
              <span className="text-[var(--gold-primary)] mt-1">•</span>
              <span className="flex-1 text-foreground/90">{cleanLine}</span>
            </div>
          );
        }

        // Standard line
        const normalLine = trimmed.replace(/\*\*|_/g, '');
        return (
          <p key={i} className="text-[13px] leading-relaxed text-foreground/90">
            {normalLine}
          </p>
        );
      })}
    </div>
  );
};

/* ─────────── Component ─────────── */
export default function ChatWidget() {
  // Session language (null = not yet chosen)
  const [sessionLang, setSessionLang] = useState<SessionLang | null>(null);
  const L = LABELS[sessionLang || "en"];

  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState({
    journey: "general" as "reservation" | "preorder" | "table_order" | "general" | null,
    booking: { date: "", time: "", guests: null as number | null, specialRequest: "" },
    cart: [] as any[],
    tableId: null as string | null
  });

  // Booking visual UI state
  const [bookingStep, setBookingStep] = useState<BookingStep>(null);
  const [booking, setBooking] = useState<BookingState>({
    date: "", dateLabel: "", time: "", guests: 2, name: "", phone: "", specialRequest: "",
    preorderType: "", preorderText: ""
  });
  const [showDeposit, setShowDeposit] = useState(false);
  const [depositSummary, setDepositSummary] = useState({ type: "", details: "", amount: "₹0" });
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());

  // Voice & Mode states
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [currentMode, setCurrentMode] = useState<'chat' | 'voice'>('chat');
  const [voiceStatus, setVoiceStatus] = useState<'idle' | 'listening' | 'processing' | 'speaking' | 'error'>('idle');
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [lastIntent, setLastIntent] = useState<string | null>(null);
  const [isSTTLoading, setIsSTTLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Refs for resolving stale closures in async voice handlers
  const chatSessionRef = useRef(chatSession);
  const sessionLangRef = useRef(sessionLang);

  useEffect(() => {
    chatSessionRef.current = chatSession;
  }, [chatSession]);

  useEffect(() => {
    sessionLangRef.current = sessionLang;
  }, [sessionLang]);

  const pathname = usePathname();

  useEffect(() => {
    // Check if we are in table mode
    const match = pathname.match(/\/table\/(.+)/);
    if (match && match[1]) {
      const table = match[1];
      setChatSession(prev => ({
        ...prev,
        tableId: table,
        journey: "table_order"
      }));
      setIsOpen(true);
      // Let the user select language first, then send an initial welcome message
    }
  }, [pathname]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen, bookingStep, isLoading]);

  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener('open-aivaiter', handleOpenChat);
    return () => window.removeEventListener('open-aivaiter', handleOpenChat);
  }, []);

  /* ── Helpers ── */
  const addMessage = useCallback((role: "user" | "bot", content: string, lang?: string) => {
    if (!content) return;
    setMessages(prev => [...prev, {
      id: Date.now().toString() + Math.random(),
      role,
      content,
      lang: lang || sessionLang || "en"
    }]);
  }, [sessionLang]);

  const selectLanguage = (lang: SessionLang) => {
    
    setSessionLang(lang);
    setMessages([{
      id: "welcome",
      role: "bot",
      content: LABELS[lang].welcome,
      lang
    }]);
  };

  /* ── Mode Switching ── */
  const toggleMode = (mode: 'chat' | 'voice') => {
    // 1. Immediate UI update
    setCurrentMode(mode);
    setVoiceStatus('idle');
    setVoiceError(null);
    setIsSTTLoading(false);

    // 2. Kill existing processes
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch(e) {}
      recognitionRef.current = null;
    }

    // 3. Mode-specific initialization
    if (mode === 'voice') {
      setSessionLang('en');
      if (messages.length === 0) {
        setMessages([{
          id: "welcome-voice",
          role: "bot",
          content: "Hello! I'm now in Voice Conversation mode. You can speak to me naturally in English.",
          lang: "en"
        }]);
      }
    }
  };

  /* ── TTS with best voice matching ── */
  const handleTTS = useCallback((msgIndex: number, text: string, lang?: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    if (playingIndex === msgIndex) {
      window.speechSynthesis.cancel();
      setPlayingIndex(null);
      setVoiceStatus('idle');
      return;
    }

    // Clean up any existing utterance/STT
    window.speechSynthesis.cancel();
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch(e) {}
    }

    // Clean text: strip markdown ###, **, bullet points, and extra spaces
    // Fix Currency: replace ₹ with "Rupees" for natural flow
    const cleanText = text
      .replace(/₹/g, ' Rupees') 
      .replace(/###/g, '')
      .replace(/\*\*/g, '')
      .replace(/•/g, '')
      .replace(/- /g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const targetLang = (lang === "hi" || lang === "hi_latn") ? "hi" : (lang === "ur" ? "ur" : "en");
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.filter(v => v.lang.startsWith(targetLang));
    
    // Prioritize natural sounding Female voices for a premium concierge feel
    const femaleVoice = preferred.find(v => 
      (v.name.toLowerCase().includes("female") || v.name.toLowerCase().includes("samantha") || v.name.toLowerCase().includes("google uk english female")) && 
      v.lang.startsWith(targetLang)
    );
    const googleVoice = preferred.find(v => v.name.toLowerCase().includes("Google") && v.lang.startsWith(targetLang));
    const premiumVoice = preferred.find(v => v.name.toLowerCase().includes("Natural") || v.name.toLowerCase().includes("Premium"));
    const localVoice = preferred.find(v => v.localService && v.lang.startsWith(targetLang));
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = lang === "hi" ? "hi-IN" : (lang === "ur" ? "ur-PK" : "en-GB"); 
    
    // Fallback: If no preferred voice is found for the requested language, we still try the default voice but let it play
    utterance.voice = femaleVoice || premiumVoice || googleVoice || localVoice || preferred[0] || null;
    utterance.pitch = 1.15; // Slightly higher for clear female tone
    utterance.rate = 1.05; // Natural conversational tempo
    utteranceRef.current = utterance;

    utterance.onstart = () => {
      setVoiceStatus('speaking');
      setPlayingIndex(msgIndex);
    };

    utterance.onend = () => {
      if (utteranceRef.current === utterance) {
        setPlayingIndex(null);
        setVoiceStatus('idle');
        utteranceRef.current = null;
        
        // Hands-free voice loop: restart listening after speaking ends
        if (currentMode === 'voice') {
          setTimeout(() => {
            // Check again that we are still in voice mode and not processing
            if (document.visibilityState === 'visible') {
               startSTT();
            }
          }, 600);
        }
      }
    };

    utterance.onerror = (e) => {
      if (e.error === 'interrupted' || e.error === 'canceled') return;
      console.error("TTS Error:", e);
      setPlayingIndex(null);
      setVoiceStatus('idle');
      utteranceRef.current = null;
    };

    window.speechSynthesis.speak(utterance);
  }, [playingIndex, currentMode]);

  /* ── STT Logic ── */
  const startSTT = () => {
    // Only allow start if in a valid mode and not already busy
    if (currentMode === 'voice' && (voiceStatus === 'speaking' || voiceStatus === 'processing')) return;
    
    setVoiceError(null);
    const w = window as any;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;

    if (!SR) {
      setVoiceStatus('error');
      setVoiceError("Voice input is not supported in this browser. Please try Chrome or Edge.");
      return;
    }

    // Clean up any existing recognition instance
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch(e) {}
    }

    const rec = new SR();
    recognitionRef.current = rec;
    const sLang = sessionLangRef.current || 'en';
    rec.lang = sLang === 'hi' ? "hi-IN" : (sLang === 'ur' ? "ur-PK" : "en-IN");
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    // rec.continuous = false; // We use recursion for loop

    rec.onstart = () => {
      setVoiceStatus('listening');
      setIsSTTLoading(true);
    };

    rec.onresult = (e: any) => {
      const t = e.results?.[0]?.[0]?.transcript;
      if (t) {
        if (currentMode === 'voice') {
          handleSend(undefined, t);
        } else {
          setInput(p => (p ? p + " " : "") + t);
          setVoiceStatus('idle');
        }
      } else {
        setVoiceStatus('idle');
      }
    };

    rec.onerror = (e: any) => {
      if (recognitionRef.current !== rec) return;
      setIsSTTLoading(false);
      
      const errorMap: Record<string, string> = {
        'not-allowed': "Microphone access was denied.",
        'service-not-allowed': "Microphone service blocked.",
        'network': "Network error.",
        'no-speech': "silence", // Silent error to avoid UI noise
        'audio-capture': "No mic found.",
        'aborted': "stopped"
      };

      const errMsg = errorMap[e.error];
      
      if (e.error === 'no-speech' || e.error === 'aborted') {
        setVoiceStatus('idle');
        // Auto-restart loop if in voice mode and it was just silence
        if (currentMode === 'voice' && e.error === 'no-speech') {
           setTimeout(() => {
             if (currentMode === 'voice' && voiceStatus === 'idle') startSTT();
           }, 1000);
        }
      } else {
        setVoiceStatus('error');
        setVoiceError(errMsg || "Try again.");
      }
    };

    rec.onend = () => {
      if (recognitionRef.current === rec) {
        setIsSTTLoading(false);
        setVoiceStatus(prev => (prev === 'listening' ? 'idle' : prev));
        recognitionRef.current = null;
      }
    };

    try {
      rec.start();
    } catch (err) {
      setVoiceStatus('idle');
      setIsSTTLoading(false);
    }
  };

  /* ── Open visual booking ── */
  const openBookingUI = () => {
    setBookingStep("date");
    setBooking({ date: "", dateLabel: "", time: "", guests: 2, name: "", phone: "", specialRequest: "", preorderType: "", preorderText: "" });
    const now = new Date();
    setCalMonth(now.getMonth());
    setCalYear(now.getFullYear());
  };

  /* ── Submit booking ── */
  const submitBooking = async () => {
    setBookingStep(null);
    addMessage("user", sessionLang === "hi"
      ? `${booking.dateLabel}, ${booking.time}, ${booking.guests} मेहमान`
      : `${booking.dateLabel}, ${booking.time}, ${booking.guests} guests`);
    
    // Crucial: Update the session memory so the AI knows the booking is confirmed
    setChatSession(prev => ({
      ...prev,
      journey: "reservation",
      booking: {
        date: booking.dateLabel || booking.date,
        time: booking.time,
        guests: booking.guests,
        specialRequest: booking.specialRequest
      }
    }));
    
    setIsLoading(true);

    try {
      await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...booking,
          source: "AIVaiter Visual Booking"
        }),
      });
    } catch { /* console fallback */ }

    setTimeout(() => {
      addMessage("bot",
        `${L.successPrefix}, ${booking.name}! ${L.successBody}\n\n📅 ${booking.dateLabel}  ⏰ ${booking.time}  👥 ${booking.guests}`,
        sessionLang || "en"
      );
      setIsLoading(false);
    }, 600);
  };

  /* ── Chat send ── */
  const handleSend = async (e?: React.FormEvent, directMessage?: string) => {
    if (e) e.preventDefault();
    const userMessage = (directMessage || input).trim();
    if (!userMessage) return;

    // 1. Interrupt any current speaking
    window.speechSynthesis.cancel();

    // 2. Handle 'Repeat' local command
    const lowMsg = userMessage.toLowerCase();
    const isRepeat = lowMsg === "repeat" || lowMsg === "repeat that" || lowMsg === "repeat please" || lowMsg.includes("fir se bolo");
    if (currentMode === 'voice' && isRepeat) {
      const lastBotMsg = [...messages].reverse().find(m => m.role === 'bot');
      if (lastBotMsg) {
        const msgIdx = messages.indexOf(lastBotMsg);
        setInput("");
        handleTTS(msgIdx, lastBotMsg.content, lastBotMsg.lang);
        return;
      }
    }

    setInput("");
    addMessage("user", userMessage);
    setIsLoading(true);
    if (currentMode === 'voice') setVoiceStatus('processing');

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMessage, 
          lang: sessionLangRef.current,
          session: chatSessionRef.current
        }),
      });
      const data = await response.json();
      if (data.session) setChatSession(data.session);
      const botMsg = data.reply;
      const botLang = data.lang || sessionLangRef.current || "en";
      const newIntent = data.intent || null;
      
      addMessage("bot", botMsg, botLang);
      setLastIntent(newIntent);

      // Auto-speak in voice mode
      if (currentMode === 'voice') {
        handleTTS(messages.length + 1, botMsg, botLang);
      } else {
        setVoiceStatus('idle');
      }

      if (data.triggerBooking) {
        setTimeout(() => openBookingUI(), 500);
      } else if (data.triggerPreorder) {
        setTimeout(() => {
          setBookingStep("preorder_type");
          setBooking(b => ({ ...b, preorderType: "", preorderText: "" }));
        }, 500);
      } else if (data.triggerGroup) {
        setTimeout(() => {
          setBookingStep("group_size");
          setBooking(b => ({ ...b, guests: 20 }));
        }, 500);
      }
    } catch {
      setVoiceStatus('idle');
      addMessage("bot", sessionLang === "hi"
        ? "कनेक्शन में समस्या है। कृपया " + restaurantConfig.contactPhone + " पर कॉल करें।"
        : "I'm having trouble connecting. Please call " + restaurantConfig.contactPhone
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Quick chips ── */
  const quickChips = [
    { label: L.reserve, action: () => { addMessage("user", L.reserve); setTimeout(() => { addMessage("bot", sessionLang === "hi" ? "बुकिंग असिस्टेंट खोल रहा हूँ..." : "Opening booking assistant..."); openBookingUI(); }, 400); } },
    { label: L.timings, action: () => handleSend(undefined, sessionLang === "hi" ? "समय" : "Timings") },
    { label: L.address, action: () => handleSend(undefined, sessionLang === "hi" ? "पता" : "Address") },
    { label: L.vegOptions, action: () => handleSend(undefined, sessionLang === "hi" ? "शाकाहारी" : "Veg Options") },
    { label: L.partyBooking, action: () => handleSend(undefined, sessionLang === "hi" ? "पार्टी बुकिंग" : "Party Booking") },
    { label: L.contact, action: () => handleSend(undefined, sessionLang === "hi" ? "संपर्क" : "Contact") },
    { label: L.changeLang, action: () => { setSessionLang(null); setMessages([]); } },
  ];

  /* ══════════════════════════════
     RENDER HELPERS
  ══════════════════════════════ */

  /* ── Calendar Date Picker ── */
  const renderDatePicker = () => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;
    const calDays = getCalendarDays(calYear, calMonth);

    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3 p-3 animate-scale-in">
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-sm font-medium text-[var(--gold-primary)] flex items-center gap-2"><Calendar className="w-4 h-4" /> {L.pickDate}</h4>
        </div>
        {/* Month nav */}
        <div className="flex items-center justify-between">
          <button onClick={() => { if (calMonth === 0) { setCalYear(y => y-1); setCalMonth(11); } else setCalMonth(m => m-1); }}
            className="p-1 rounded-full hover:bg-surface-highest transition-colors text-foreground/60 hover:text-foreground"><ChevronLeft className="w-4 h-4" /></button>
          <span className="text-sm font-medium">{MONTH_NAMES[calMonth]} {calYear}</span>
          <button onClick={() => { if (calMonth === 11) { setCalYear(y => y+1); setCalMonth(0); } else setCalMonth(m => m+1); }}
            className="p-1 rounded-full hover:bg-surface-highest transition-colors text-foreground/60 hover:text-foreground"><ChevronRight className="w-4 h-4" /></button>
        </div>
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-foreground/40 font-medium">
          {DAY_NAMES.map(d => <div key={d}>{d}</div>)}
        </div>
        {/* Days */}
        <div className="grid grid-cols-7 gap-1">
          {calDays.map((day, i) => {
            if (day === null) return <div key={`b${i}`} />;
            const dateStr = `${calYear}-${String(calMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
            const isPast = dateStr < todayStr;
            const isToday = dateStr === todayStr;
            const isSelected = booking.date === dateStr;
            return (
              <button
                key={dateStr}
                disabled={isPast}
                onClick={() => setBooking(b => ({
                  ...b,
                  date: dateStr,
                  dateLabel: `${day} ${MONTH_NAMES[calMonth]} ${calYear}`
                }))}
                className={`cal-day w-8 h-8 text-xs rounded-lg flex items-center justify-center cursor-pointer
                  ${isPast ? "text-foreground/20 cursor-not-allowed" : ""}
                  ${isToday ? "today" : ""}
                  ${isSelected ? "selected" : "hover:bg-surface-highest text-foreground/80"}`}
              >
                {day}
              </button>
            );
          })}
        </div>
        {/* Next button */}
        <button
          disabled={!booking.date}
          onClick={() => setBookingStep("time")}
          className="mt-1 w-full py-2.5 rounded-xl text-sm font-medium bg-[var(--gold-primary)] text-[#121212] disabled:opacity-30 disabled:cursor-not-allowed hover:brightness-110 transition-all active:scale-[0.98]"
        >
          {L.next} →
        </button>
      </motion.div>
    );
  };

  /* ── Time Slot Picker ── */
  const renderTimePicker = () => {
    const slots = getSlots(booking.date);
    const statusColor = { available: "border-emerald-500/40 text-emerald-400", limited: "border-amber-500/40 text-amber-400", full: "border-red-500/30 text-red-400" };
    const statusDot = { available: "bg-emerald-400", limited: "bg-amber-400", full: "bg-red-400" };
    const statusLabel = { available: L.available, limited: L.limited, full: L.full };

    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-3 p-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-[var(--gold-primary)] flex items-center gap-2"><Clock className="w-4 h-4" /> {L.pickTime}</h4>
          <span className="text-[10px] text-foreground/40">{booking.dateLabel}</span>
        </div>
        {/* Legend */}
        <div className="flex gap-3 text-[10px] text-foreground/50">
          {(["available","limited","full"] as const).map(s => (
            <span key={s} className="flex items-center gap-1"><span className={`w-1.5 h-1.5 rounded-full ${statusDot[s]}`} />{statusLabel[s]}</span>
          ))}
        </div>
        {/* Slots */}
        <div className="grid grid-cols-2 gap-2">
          {slots.map(slot => (
            <button
              key={slot.time}
              disabled={slot.status === "full"}
              onClick={() => setBooking(b => ({ ...b, time: slot.time }))}
              className={`slot-card px-3 py-2.5 rounded-xl border text-sm flex items-center justify-between
                ${slot.status === "full" ? "opacity-40 cursor-not-allowed border-surface-highest" : "cursor-pointer"}
                ${booking.time === slot.time ? "border-[var(--gold-primary)] bg-[var(--gold-primary)]/10 text-[var(--gold-primary)]" : `${statusColor[slot.status]} bg-surface-low`}
              `}
            >
              <span className="font-medium">{slot.time}</span>
              <span className={`w-2 h-2 rounded-full ${statusDot[slot.status]}`} />
            </button>
          ))}
        </div>
        {/* Nav */}
        <div className="flex gap-2 mt-1">
          <button onClick={() => setBookingStep("date")} className="flex-1 py-2 rounded-xl text-sm border border-surface-highest hover:border-[var(--gold-primary)]/30 transition-colors">{L.back}</button>
          <button disabled={!booking.time} onClick={() => setBookingStep("guests")}
            className="flex-1 py-2 rounded-xl text-sm font-medium bg-[var(--gold-primary)] text-[#121212] disabled:opacity-30 hover:brightness-110 transition-all">{L.next} →</button>
        </div>
      </motion.div>
    );
  };

  /* ── Guest Counter ── */
  const renderGuestPicker = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-4 p-3">
      <h4 className="text-sm font-medium text-[var(--gold-primary)] flex items-center gap-2"><Users className="w-4 h-4" /> {L.pickGuests}</h4>
      <div className="flex items-center justify-center gap-6 py-4">
        <button onClick={() => setBooking(b => ({ ...b, guests: Math.max(1, b.guests - 1) }))}
          className="w-10 h-10 rounded-full border border-surface-highest flex items-center justify-center hover:border-[var(--gold-primary)]/40 hover:text-[var(--gold-primary)] transition-colors active:scale-90">
          <Minus className="w-4 h-4" />
        </button>
        <div className="text-center">
          <span className="text-4xl font-serif text-[var(--gold-primary)]">{booking.guests}</span>
          <p className="text-xs text-foreground/40 mt-1">{sessionLang === "hi" ? "मेहमान" : "guests"}</p>
        </div>
        <button onClick={() => setBooking(b => ({ ...b, guests: Math.min(20, b.guests + 1) }))}
          className="w-10 h-10 rounded-full border border-surface-highest flex items-center justify-center hover:border-[var(--gold-primary)]/40 hover:text-[var(--gold-primary)] transition-colors active:scale-90">
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="flex gap-2">
        <button onClick={() => setBookingStep("time")} className="flex-1 py-2 rounded-xl text-sm border border-surface-highest hover:border-[var(--gold-primary)]/30 transition-colors">{L.back}</button>
        <button onClick={() => setBookingStep("details")}
          className="flex-1 py-2 rounded-xl text-sm font-medium bg-[var(--gold-primary)] text-[#121212] hover:brightness-110 transition-all">{L.next} →</button>
      </div>
    </motion.div>
  );

  /* ── Details Form ── */
  const renderDetailsForm = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-3 p-3">
      <h4 className="text-sm font-medium text-[var(--gold-primary)] flex items-center gap-2"><User className="w-4 h-4" /> {L.yourDetails}</h4>
      <div className="space-y-3">
        <div>
          <label className="text-[11px] text-foreground/50 mb-1 block">{L.name}</label>
          <input value={booking.name} onChange={e => setBooking(b => ({ ...b, name: e.target.value }))}
            className="w-full bg-surface-low border border-surface-highest rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-foreground/30 transition-all"
            placeholder={sessionLang === "hi" ? "आपका नाम" : "Your name"} />
        </div>
        <div>
          <label className="text-[11px] text-foreground/50 mb-1 block flex items-center gap-1"><Phone className="w-3 h-3" /> {L.phone}</label>
          <input value={booking.phone} onChange={e => setBooking(b => ({ ...b, phone: e.target.value }))}
            className="w-full bg-surface-low border border-surface-highest rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-foreground/30 transition-all"
            placeholder="+91 9XXXX XXXXX" type="tel" />
        </div>
        <div>
          <label className="text-[11px] text-foreground/50 mb-1 block">{L.special}</label>
          <textarea value={booking.specialRequest} onChange={e => setBooking(b => ({ ...b, specialRequest: e.target.value }))}
            rows={2}
            className="w-full bg-surface-low border border-surface-highest rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-foreground/30 resize-none transition-all"
            placeholder={sessionLang === "hi" ? "एलर्जी, अवसर..." : "Allergies, occasion..."} />
        </div>
      </div>
      <div className="flex gap-2 mt-1">
        <button onClick={() => setBookingStep("guests")} className="flex-1 py-2 rounded-xl text-sm border border-surface-highest hover:border-[var(--gold-primary)]/30 transition-colors">{L.back}</button>
        <button disabled={!booking.name.trim() || !booking.phone.trim()} onClick={() => setBookingStep("confirm")}
          className="flex-1 py-2 rounded-xl text-sm font-medium bg-[var(--gold-primary)] text-[#121212] disabled:opacity-30 hover:brightness-110 transition-all">{L.next} →</button>
      </div>
    </motion.div>
  );

  /* ── Pre-order Flow ── */
  const renderPreorderFlow = () => {
    if (bookingStep === "preorder_type") {
      return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-4 p-3 font-sans">
          <h4 className="text-sm font-medium text-[var(--gold-primary)] flex items-center gap-2"><Sparkles className="w-4 h-4" /> {L.preorderTitle}</h4>
          <p className="text-xs text-foreground/50">{L.preorderType}</p>
          <div className="grid grid-cols-1 gap-2">
            {[
              { id: "cake", label: L.cake, amount: "₹500" },
              { id: "anniversary", label: L.anniversary, amount: "₹1,200" },
              { id: "decoration", label: L.decoration, amount: "₹800" }
            ].map(type => (
              <button 
                key={type.id}
                onClick={() => {
                  setBooking(b => ({ ...b, preorderType: type.label }));
                  setBookingStep("preorder_details");
                }}
                className="flex items-center justify-between p-4 rounded-xl border border-surface-highest bg-surface hover:border-[var(--gold-primary)]/50 transition-all group"
              >
                <span className="text-sm">{type.label}</span>
                <span className="text-xs text-[var(--gold-primary)] opacity-60 group-hover:opacity-100">{type.amount} dep.</span>
              </button>
            ))}
          </div>
          <button onClick={() => setBookingStep(null)} className="py-2 text-xs text-foreground/30 hover:text-foreground/60 transition-colors uppercase tracking-widest">{L.back}</button>
        </motion.div>
      );
    }

    if (bookingStep === "preorder_details") {
      return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-4 p-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-[var(--gold-primary)]">{booking.preorderType}</h4>
          </div>
          <div>
            <label className="text-[11px] text-foreground/50 mb-2 block">{L.preorderDetails}</label>
            <textarea 
              value={booking.preorderText} 
              onChange={e => setBooking(b => ({ ...b, preorderText: e.target.value }))}
              rows={3}
              className="w-full bg-surface-low border border-surface-highest rounded-xl px-4 py-3 text-sm text-foreground focus:border-[var(--gold-primary)]/50 transition-all resize-none"
              placeholder={sessionLang === "hi" ? "केक पर क्या लिखना है? (जैसे- जन्मदिन मुबारक राहुल)" : "What should we write? (e.g. Happy Birthday Rahul)"}
            />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setBookingStep("preorder_type")} className="flex-1 py-2.5 rounded-xl text-sm border border-surface-highest hover:border-[var(--gold-primary)]/30 transition-colors">{L.back}</button>
            <button 
              disabled={!booking.preorderText.trim()}
              onClick={() => setBookingStep("details")}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-[var(--gold-primary)] text-[#121212] hover:brightness-110 transition-all"
            >
              {L.next} →
            </button>
          </div>
        </motion.div>
      );
    }

    return null;
  };

  /* ── Group Enquiry Flow ── */
  const renderGroupFlow = () => {
    if (bookingStep === "group_size") {
      return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-4 p-3">
          <h4 className="text-sm font-medium text-[var(--gold-primary)] flex items-center gap-2"><Users className="w-4 h-4" /> {L.groupTitle}</h4>
          <p className="text-xs text-foreground/50">{L.groupSize}</p>
          <div className="flex items-center justify-center gap-6 py-4">
            <button onClick={() => setBooking(b => ({ ...b, guests: Math.max(20, b.guests - 5) }))}
              className="w-10 h-10 rounded-full border border-surface-highest flex items-center justify-center hover:border-[var(--gold-primary)]/40 text-[var(--gold-primary)] transition-colors">
              <Minus className="w-4 h-4" />
            </button>
            <div className="text-center">
              <span className="text-4xl font-serif text-[var(--gold-primary)]">{booking.guests}</span>
              <p className="text-xs text-foreground/40 mt-1">{sessionLang === "hi" ? "मेहमान" : "guests"}</p>
            </div>
            <button onClick={() => setBooking(b => ({ ...b, guests: Math.min(200, b.guests + 5) }))}
              className="w-10 h-10 rounded-full border border-surface-highest flex items-center justify-center hover:border-[var(--gold-primary)]/40 text-[var(--gold-primary)] transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <button onClick={() => setBookingStep("details")}
            className="w-full py-3 rounded-xl text-sm font-medium bg-[var(--gold-primary)] text-[#121212] hover:brightness-110 transition-all">
            {L.next} →
          </button>
        </motion.div>
      );
    }
    return null;
  };

  /* ── Submit Logic ── */
  const handleSubmit = async () => {
    const isPreorder = bookingStep?.startsWith("preorder");
    const isGroup = bookingStep?.startsWith("group");
    
    setBookingStep(null);
    setIsLoading(true);

    const amount = isPreorder ? (booking.preorderType.includes("Cake") ? "₹500" : "₹1,000") : "₹2,500";
    const typeLabel = isPreorder ? "Celebration Pre-order" : isGroup ? "Group Event Enquiry" : "Table Booking Request";

    try {
      await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...booking, typeLabel }),
      });
    } catch { /* skip */ }

    setTimeout(() => {
      const isHindi = sessionLang === "hi";
      let confirmationMsg = "";

      if (isHindi) {
        confirmationMsg = `धन्यवाद ${booking.name}! ${booking.dateLabel} को ${booking.time || ""} पर ${booking.guests} मेहमानों के लिए आपका ${typeLabel} दर्ज कर लिया गया है। हमारी टीम जल्द ही आपसे संपर्क करेगी।`;
      } else {
        confirmationMsg = `Thanks, ${booking.name}. Your ${typeLabel.toLowerCase()} for ${booking.guests} guests on ${booking.dateLabel} at ${booking.time || ""} has been recorded. Our team will contact you shortly to confirm.`;
      }

      addMessage("bot", confirmationMsg);
      
      if (isPreorder || isGroup) {
        setDepositSummary({
          type: typeLabel,
          details: isPreorder ? `${booking.preorderType}: ${booking.preorderText}` : `${booking.guests} Guests Event`,
          amount: amount
        });
        setTimeout(() => setShowDeposit(true), 600);
      }
      
      setIsLoading(false);
    }, 1000);
  };

  /* ── Confirmation ── */
  const renderConfirmation = () => (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col gap-3 p-3">
      <h4 className="text-sm font-medium text-[var(--gold-primary)] flex items-center gap-2"><Sparkles className="w-4 h-4" /> {L.confirm}</h4>
      <div className="bg-surface-low rounded-xl p-4 space-y-2 border border-surface-highest">
        <div className="flex justify-between text-sm"><span className="text-foreground/50">📅 {sessionLang === "hi" ? "तारीख़" : "Date"}</span><span className="font-medium">{booking.dateLabel || "Today"}</span></div>
        {booking.time && <div className="flex justify-between text-sm"><span className="text-foreground/50">⏰ {sessionLang === "hi" ? "समय" : "Time"}</span><span className="font-medium">{booking.time}</span></div>}
        <div className="flex justify-between text-sm"><span className="text-foreground/50">👥 {sessionLang === "hi" ? "मेहमान" : "Guests"}</span><span className="font-medium">{booking.guests}</span></div>
        <div className="flex justify-between text-sm"><span className="text-foreground/50">👤 {sessionLang === "hi" ? "नाम" : "Name"}</span><span className="font-medium">{booking.name}</span></div>
        <div className="flex justify-between text-sm"><span className="text-foreground/50">📱 {sessionLang === "hi" ? "फ़ोन" : "Phone"}</span><span className="font-medium">{booking.phone}</span></div>
        {booking.preorderType && (
          <div className="flex flex-col gap-1 pt-2 border-t border-surface-highest mt-1">
             <span className="text-[10px] text-[var(--gold-primary)] uppercase tracking-widest">{booking.preorderType}</span>
             <span className="text-sm font-medium italic">"{booking.preorderText}"</span>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <button onClick={() => setBookingStep("details")} className="flex-1 py-2 rounded-xl text-sm border border-surface-highest hover:border-[var(--gold-primary)]/30 transition-colors">{L.back}</button>
        <button onClick={handleSubmit}
          className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-[var(--gold-primary)] to-[var(--gold-light)] text-[#121212] hover:brightness-110 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
          <Check className="w-4 h-4" /> {L.submit}
        </button>
      </div>
    </motion.div>
  );

  /* ── Step indicator ── */
  const getStepIndex = () => {
    if (!bookingStep) return -1;
    if (bookingStep.includes("preorder")) return 1;
    if (bookingStep.includes("group")) return 1;
    const steps = ["date", "time", "guests", "details", "confirm"];
    return steps.indexOf(bookingStep);
  };

  const renderStepDots = () => {
    if (!bookingStep) return null;
    const current = getStepIndex();
    if (current === -1) return null;
    return (
      <div className="flex items-center justify-center gap-1.5 py-2">
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === current ? "w-5 bg-[var(--gold-primary)]" : i < current ? "w-2 bg-[var(--gold-primary)]/50" : "w-2 bg-surface-highest"}`} />
        ))}
      </div>
    );
  };

  const renderSessionSummary = () => {
    if (!chatSession.booking.date && chatSession.cart.length === 0) return null;

    return (
      <div className="flex flex-col gap-2 mt-2">
        {chatSession.booking.date && (
          <div className="bg-surface-low border border-[var(--gold-primary)]/30 p-3 rounded-xl flex justify-between items-center shadow-lg">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-[var(--gold-primary)] font-medium mb-0.5">{sessionLang === "hi" ? "रिज़र्वेशन" : sessionLang === "ur" ? "بکنگ" : "Reservation"}</p>
              <p className="text-[13px] text-foreground/90 font-medium">
                {chatSession.booking.date} 
                {chatSession.booking.time ? ` at ${chatSession.booking.time}` : ''}
                {chatSession.booking.guests ? ` for ${chatSession.booking.guests}` : ''}
              </p>
            </div>
            <Calendar className="w-5 h-5 text-[var(--gold-primary)]/70" />
          </div>
        )}
        
        {chatSession.cart.length > 0 && (
          <div className="bg-surface-low border border-emerald-500/30 p-3 rounded-xl shadow-lg">
            <p className="text-[11px] uppercase tracking-wider text-emerald-400 font-medium mb-2 flex items-center gap-1.5"><UtensilsCrossed className="w-3.5 h-3.5"/> {sessionLang === "hi" ? "ऑर्डर" : sessionLang === "ur" ? "آرڈر" : "Order Summary"}</p>
            {chatSession.cart.map((item, idx) => {
               const price = restaurantConfig.fullMenu.flatMap(c => c.items).find(i => i.id === item.id)?.numericPrice || 0;
               return (
                <div key={idx} className="flex justify-between text-[13px] text-foreground/80 mb-1.5">
                  <span className="truncate pr-2"><span className="text-foreground font-medium">{item.quantity}x</span> {item.name}</span>
                  <span className="shrink-0 text-foreground">₹{price * item.quantity}</span>
                </div>
               );
            })}
            <div className="border-t border-surface-highest/80 mt-2.5 pt-2 flex justify-between font-medium text-sm">
              <span className="text-foreground/80">{sessionLang === "hi" ? "कुल" : sessionLang === "ur" ? "کل" : "Total"}:</span>
              <span className="text-[var(--gold-primary)]">
                ₹{chatSession.cart.reduce((total, item) => total + (restaurantConfig.fullMenu.flatMap(c => c.items).find(i => i.id === item.id)?.numericPrice || 0) * item.quantity, 0)}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  /* ══════════════════════════════
     MAIN RENDER
  ══════════════════════════════ */
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className={`fixed flex flex-col bg-surface-high border border-[rgba(212,175,55,0.15)] rounded-2xl shadow-2xl overflow-hidden transition-[box-shadow,border-color,background-color] duration-500 will-change-[transform,opacity] backface-hidden transform-gpu
              ${currentMode === 'voice' ? 'voice-glow border-[var(--gold-primary)]/40 shadow-[0_0_40px_rgba(197,160,40,0.15)]' : 'ambient-shadow'}`}
            style={{ 
              position: 'fixed', 
              bottom: '100px', 
              right: isExpanded ? 'calc(50vw - 400px)' : '24px', 
              width: isExpanded ? '800px' : '400px', 
              maxWidth: 'calc(100vw - 48px)',
              height: isExpanded ? '85vh' : '600px', 
              maxHeight: '85vh',
              zIndex: 9999,
              transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), height 0.3s cubic-bezier(0.4, 0, 0.2, 1), right 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              left: 'auto'
            }}
          >
            {/* ── Header ── */}
            <div className="bg-surface-highest p-3 flex flex-col border-b border-[rgba(212,175,55,0.1)]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-tr from-[var(--gold-primary)] to-[var(--gold-light)]">
                    <UtensilsCrossed className="w-4 h-4 text-[#121212]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-sm text-foreground leading-tight">AIVaiter</h3>
                    <p className="text-[10px] text-[var(--gold-primary)] opacity-80 uppercase tracking-wider">{restaurantConfig.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setIsExpanded(e => !e)} className="p-1.5 hover:bg-surface-low rounded-full transition-colors text-foreground/40" title="Toggle Size">
                    {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                  <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-surface-low rounded-full transition-colors text-foreground/40" title="Close">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Segmented Mode Switcher */}
              <div className="flex bg-surface-lowest/50 p-1 rounded-xl border border-surface-highest/50">
                <button 
                  onClick={() => toggleMode('chat')}
                  className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-[11px] font-medium transition-all
                    ${currentMode === 'chat' 
                      ? "bg-surface-highest text-[var(--gold-primary)] shadow-sm" 
                      : "text-foreground/40 hover:text-foreground/70"}`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Chat
                </button>
                <button 
                  onClick={() => toggleMode('voice')}
                  className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-[11px] font-medium transition-all
                    ${currentMode === 'voice' 
                      ? "bg-surface-highest text-[var(--gold-primary)] shadow-sm border border-[var(--gold-primary)]/20" 
                      : "text-foreground/40 hover:text-foreground/70"}`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  Voice
                </button>
              </div>
            </div>

            {/* ── Body ── */}
            {!sessionLang ? (
              /* ── Language Selection Screen ── */
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center gap-6 p-6">
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-tr from-[var(--gold-primary)] to-[var(--gold-light)] animate-float">
                  <Globe className="w-8 h-8 text-[#121212]" />
                </div>
                <div className="text-center">
                  <h3 className="font-serif text-xl mb-2">Choose Your Language</h3>
                  <p className="text-sm text-foreground/50">भाषा चुनें</p>
                </div>
                <div className="flex flex-col gap-3 w-full max-w-[220px]">
                  <button onClick={() => selectLanguage("en")}
                    className="w-full py-3.5 rounded-xl border border-surface-highest text-sm font-medium hover-lift chip-hover flex items-center justify-center gap-2 bg-surface">
                    English
                  </button>
                  <button onClick={() => selectLanguage("hi")}
                    className="w-full py-3.5 rounded-xl border border-surface-highest text-sm font-medium hover-lift chip-hover flex items-center justify-center gap-2 bg-surface">
                    हिंदी
                  </button>
                  <button onClick={() => selectLanguage("ur")}
                    className="w-full py-3.5 rounded-xl border border-surface-highest text-[16px] font-medium hover-lift chip-hover flex items-center justify-center gap-2 bg-surface font-serif">
                    اردو
                  </button>
                </div>
              </motion.div>
            ) : bookingStep ? (
              /* ── Visual Booking Flow ── */
              <div className="flex-1 overflow-y-auto chat-scroll flex flex-col">
                {renderStepDots()}
                <div className="flex-1 overflow-y-auto">
                  {bookingStep === "date" && renderDatePicker()}
                  {bookingStep === "time" && renderTimePicker()}
                  {bookingStep === "guests" && renderGuestPicker()}
                  {bookingStep === "details" && renderDetailsForm()}
                  {bookingStep === "confirm" && renderConfirmation()}
                  {bookingStep?.startsWith("preorder") && renderPreorderFlow()}
                  {bookingStep?.startsWith("group") && renderGroupFlow()}
                </div>
                {/* Cancel booking */}
                <div className="p-2 text-center">
                  <button onClick={() => setBookingStep(null)} className="text-[11px] text-foreground/30 hover:text-foreground/60 transition-colors">
                    {sessionLang === "hi" ? "बुकिंग रद्द करें" : "Cancel booking"} ✕
                  </button>
                </div>
              </div>
            ) : (
              /* ── Chat Messages ── */
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3 chat-scroll">
                  {messages.map((msg, index) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`relative max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                          msg.role === "user"
                            ? "bg-surface-low border border-[rgba(212,175,55,0.2)] text-foreground"
                            : "bg-gradient-to-br from-[#1c1b1b] to-[#252424] border border-transparent shadow-md text-foreground/90 leading-relaxed pr-10"
                        }`}
                      >
                        {msg.role === "bot" && (
                          <button
                            onClick={() => handleTTS(index, msg.content, msg.lang)}
                            className={`absolute top-2 right-2 p-1.5 rounded-full transition-all duration-200
                              ${playingIndex === index ? "text-[var(--gold-primary)] bg-[var(--gold-primary)]/10 scale-110" : "text-foreground/30 hover:text-foreground/70 hover:bg-surface-high"}`}
                          >
                            {playingIndex === index ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                          </button>
                        )}
                        <FormattedMessage content={msg.content} />
                      </div>
                    </motion.div>
                  ))}

                  {/* Session Summary (Bookings/Cart) */}
                  {renderSessionSummary()}

                  {/* Quick Chips */}
                  {!isLoading && messages.length > 0 && messages[messages.length - 1]?.role === "bot" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex flex-wrap gap-1.5 pt-2">
                      {quickChips.map((chip, idx) => (
                        <button key={idx} onClick={chip.action}
                          className="chip-hover px-3 py-1.5 text-[11px] rounded-full bg-surface border border-surface-highest text-foreground/70 flex items-center gap-1">
                          {chip.label} <ChevronRight className="w-3 h-3" />
                        </button>
                      ))}
                    </motion.div>
                  )}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-surface-low rounded-2xl px-4 py-3 flex gap-1.5 items-center">
                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1.5 h-1.5 bg-[var(--gold-primary)]/60 rounded-full" />
                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.15 }} className="w-1.5 h-1.5 bg-[var(--gold-primary)]/60 rounded-full" />
                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.3 }} className="w-1.5 h-1.5 bg-[var(--gold-primary)]/60 rounded-full" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* ── Input Area ── */}
                <div className="p-3 bg-surface-highest border-t border-[rgba(212,175,55,0.08)] relative min-h-[80px] flex flex-col justify-center">
                  
                  {/* Visual Voice Status Overlay */}
                  <AnimatePresence>
                    {(voiceStatus !== 'idle' || voiceError) && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute -top-12 left-3 right-3 z-[60] flex justify-center pointer-events-none"
                      >
                        <div className={`
                          backdrop-blur-md border px-4 py-2 rounded-2xl shadow-2xl flex items-center gap-3
                          ${voiceStatus === 'error' ? 'bg-red-950/90 border-red-500/50' : 'bg-surface-high/95 border-[var(--gold-primary)]/30'}
                        `}>
                          {voiceStatus !== 'error' && (
                            <div className="flex gap-1.5">
                              <motion.div animate={{ height: [4, 16, 4] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1 bg-[var(--gold-primary)] rounded-full" />
                              <motion.div animate={{ height: [12, 4, 12] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.1 }} className="w-1 bg-[var(--gold-primary)] rounded-full" />
                              <motion.div animate={{ height: [4, 16, 4] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className="w-1 bg-[var(--gold-primary)] rounded-full" />
                            </div>
                          )}
                          <span className={`text-[11px] font-bold tracking-tight ${voiceStatus === 'error' ? 'text-red-200' : 'text-[var(--gold-primary)]'}`}>
                            {voiceStatus === 'listening' ? 'LISTENING...' :
                             voiceStatus === 'processing' ? 'PROCESSING...' :
                             voiceStatus === 'speaking' ? 'SPEAKING...' :
                             voiceStatus === 'error' ? (voiceError || 'ERROR') : ''}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Mode-specific Input Controls */}
                  <div className="relative">
                    {currentMode === 'voice' ? (
                      <div className="flex flex-col items-center gap-2 py-2 animate-scale-in">
                        <button 
                          type="button"
                          onClick={startSTT}
                          disabled={voiceStatus !== 'idle'}
                          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all bg-surface-lowest border premium-shimmer
                            ${voiceStatus === 'listening' 
                              ? 'border-[var(--gold-primary)] text-[var(--gold-primary)] scale-110 shadow-[0_0_30px_rgba(212,175,55,0.4)]' 
                              : 'border-surface-highest text-foreground/40 hover:border-[var(--gold-primary)]/40 hover:text-foreground/60 shadow-lg'}
                          `}
                        >
                           <Mic className={`w-8 h-8 ${voiceStatus === 'listening' ? 'animate-pulse text-[var(--gold-primary)]' : ''}`} />
                        </button>
                        <p className="text-[10px] text-foreground/30 uppercase tracking-[0.2em] font-medium">Tap to Speak (English)</p>
                      </div>
                    ) : (
                      <form onSubmit={handleSend} className="relative flex items-center gap-2">
                        <button 
                          type="button" 
                          onClick={startSTT}
                          disabled={voiceStatus !== 'idle'}
                          className={`p-2.5 rounded-xl border transition-all
                            ${voiceStatus === 'listening' ? 'bg-[var(--gold-primary)]/20 border-[var(--gold-primary)] text-[var(--gold-primary)]' : 'bg-surface-lowest border-surface-highest text-foreground/40 hover:text-foreground/70'}`}
                        >
                          <Mic className="w-5 h-5" />
                        </button>
                        <input
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          placeholder={sessionLang === "hi" ? "अपना सवाल पूछें..." : "Type a message..."}
                          className="flex-1 bg-surface-lowest border border-surface-highest rounded-xl px-4 py-2.5 text-sm focus:border-[var(--gold-primary)]/40 transition-all placeholder:text-foreground/20"
                        />
                        <button
                          type="submit"
                          disabled={!input.trim() || isLoading}
                          className="p-2.5 bg-[var(--gold-primary)] text-[#121212] rounded-xl hover:brightness-110 transition-all disabled:opacity-20 active:scale-95"
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FAB ── */}
      <motion.button
        id="chat-trigger"
        onClick={() => setIsOpen(o => !o)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed w-14 h-14 bg-gradient-to-tr from-[var(--gold-primary)] to-[var(--gold-light)] rounded-full flex items-center justify-center shadow-[0_0_32px_rgba(212,175,55,0.4)] animate-gold-pulse premium-shimmer border border-[var(--gold-primary)]/20"
        style={{ 
          position: 'fixed', 
          bottom: '24px', 
          right: '24px', 
          zIndex: 9999,
          left: 'auto'
        }}
      >
        {isOpen ? <X className="w-6 h-6 text-[#121212]" /> : <MessageSquare className="w-6 h-6 text-[#121212]" />}
      </motion.button>

      <DepositModal 
        isOpen={showDeposit}
        onClose={() => setShowDeposit(false)}
        summary={depositSummary}
      />
    </>
  );
}
