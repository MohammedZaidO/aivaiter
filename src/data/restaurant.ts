export const serviceConfig = {
  founder: "Mohammed Zaid",
  role: "Founder / AI Concierge Solutions",
  phone: "+91 8688602788",
  email: "projectdesk.ai@gmail.com",
  brand: "AIVaiter",
};

export const restaurantConfig = {
  name: "Saffron Table",
  address: "Road No. 45, Jubilee Hills",
  city: "Hyderabad",
  timings: "12 PM to 11 PM",
  cuisine: "North Indian, Chinese, Mughlai",
  vegOptions: "Yes",
  parking: "Yes",
  reservations: "Yes",
  partyBookings: "Yes",
  takeaway: "Yes",
  contactPhone: "+91 90000 00000",
  contactEmail: "bookings@saffrontable.in",
  // Full Menu for Chat Discovery and Pre-ordering
  fullMenu: [
    {
      category: "Signature Dishes",
      keywords: ["signature", "special", "best", "famous", "must try"],
      items: [
        { id: "sig_1", name: "Nizam-e-Khaas Biryani", price: "₹650", numericPrice: 650, desc: "Long-grain basmati rice cooked with succulent lamb and hand-picked spices.", isNonVeg: true },
        { id: "sig_2", name: "Saffron Butter Chicken", price: "₹550", numericPrice: 550, desc: "Charcoal-grilled chicken tossed in a rich, creamy tomato gravy with a hint of Kesar.", isNonVeg: true }
      ]
    },
    {
      category: "Starters",
      keywords: ["starter", "appetizer", "kebab", "tikka", "snack"],
      items: [
        { id: "str_1", name: "Galouti Kebab", price: "₹450", numericPrice: 450, desc: "Melt-in-your-mouth spiced lamb patties served on a mini Ulte Tawa Paratha.", isNonVeg: true },
        { id: "str_2", name: "Murg Malai Tikka", price: "₹450", numericPrice: 450, desc: "Chicken breast marinated in cream, cheese, and ginger, grilled to perfection.", isNonVeg: true },
        { id: "str_3", name: "Paneer Pakeezah Tikka", price: "₹380", numericPrice: 380, desc: "Stuffed cottage cheese cubes marinated in yellow chili and yogurt.", isVeg: true }
      ]
    },
    {
      category: "Desserts",
      keywords: ["dessert", "sweet", "meetha", "sugar", "cake"],
      items: [
        { id: "des_1", name: "Shahi Tukda", price: "₹250", numericPrice: 250, desc: "Crispy bread pudding soaked in saffron-infused milk and topped with nuts.", isVeg: true },
        { id: "des_2", name: "Kesari Phirni", price: "₹220", numericPrice: 220, desc: "Slow-cooked rice pudding with cardamom and saffron.", isVeg: true }
      ]
    },
    {
      category: "Main Course",
      keywords: ["main course", "lunch", "dinner", "roti", "curry", "paneer", "chicken", "lamb"],
      items: [
        { id: "mc_1", name: "Dal Saffron", price: "₹350", numericPrice: 350, desc: "Signature black lentils slow-cooked overnight with cream and butter.", isVeg: true },
        { id: "mc_2", name: "Paneer Lababdar", price: "₹420", numericPrice: 420, desc: "Soft cottage cheese in a rich tomato and onion gravy with ginger juliennes.", isVeg: true },
        { id: "mc_3", name: "Chicken Tikka Masala", price: "₹520", numericPrice: 520, desc: "Classic tandoori chicken chunks in a spicy tomato-onion base.", isNonVeg: true },
        { id: "mc_4", name: "Rogan Josh", price: "₹580", numericPrice: 580, desc: "Classic Kashmiri lamb curry cooked in a traditional flavored yogurt base.", isNonVeg: true }
      ]
    },
    {
      category: "Biryani & Rice",
      keywords: ["biryani", "rice", "pulao", "chawal"],
      items: [
        { id: "bir_1", name: "Nizam-e-Khaas Biryani", price: "₹650", numericPrice: 650, desc: "Long-grain basmati rice cooked with succulent lamb and hand-picked spices.", isNonVeg: true },
        { id: "bir_2", name: "Dum Murg Biryani", price: "₹550", numericPrice: 550, desc: "Fragrant saffron rice layered with marinated chicken and fried onions.", isNonVeg: true },
        { id: "bir_3", name: "Subz Tarkari Biryani", price: "₹450", numericPrice: 450, desc: "Assorted vegetables cooked with aromatic rice in a slow-dum style.", isVeg: true }
      ]
    },
    {
      category: "Beverages",
      keywords: ["drinks", "beverage", "mocktail", "juice", "water", "tea", "coffee"],
      items: [
        { id: "bev_1", name: "Saffron Lassi", price: "₹180", numericPrice: 180, desc: "Thick yogurt shake infused with royal saffron and dry fruits.", isVeg: true },
        { id: "bev_2", name: "Masala Chai", price: "₹80", numericPrice: 80, desc: "Authentic Indian spiced tea brewed with ginger and cardamom.", isVeg: true },
        { id: "bev_3", name: "Fresh Lime Soda", price: "₹120", numericPrice: 120, desc: "Refreshing sweet or salty lime soda with mint.", isVeg: true }
      ]
    }
  ]
};

export const chatbotFaqs = [
  {
    keywords: ["timing", "time", "open", "close", "hours", "when"],
    answer: `We are open every day from ${restaurantConfig.timings}.`,
  },
  {
    keywords: ["location", "locate", "where", "address", "city"],
    answer: `We are located in ${restaurantConfig.city}.`,
  },
  {
    keywords: ["reservation", "book", "table", "reserve"],
    answer: `I can help you place a reservation request.`,
    triggerBooking: true,
  },
  {
    keywords: ["veg", "vegetarian", "vegan", "plant"],
    answer: `Yes, we have a wide variety of delicious vegetarian options available.`,
  },
  {
    keywords: ["party", "birthday", "event", "group", "large", "celebrate"],
    answer: `Absolutely! We host birthday parties and large group events. Let me help you place a request.`,
    triggerBooking: true,
  },
  {
    keywords: ["parking", "park", "car", "valet"],
    answer: `Yes, parking is available for our guests.`,
  },
  {
    keywords: ["takeaway", "take away", "parcel", "delivery", "order online"],
    answer: `Yes, we do offer takeaway services.`,
  },
    {
      keywords: ["cuisine", "menu", "food", "serve", "dish", "eat"],
      answer: `We serve an exquisite array of ${restaurantConfig.cuisine}. Would you like to see our starters, main course, or the signature biryani menu?`,
    },
  {
    keywords: ["contact", "phone", "number", "email", "call", "reach"],
    answer: `You can reach us at ${restaurantConfig.contactPhone} or email us at ${restaurantConfig.contactEmail}.`,
  },
];

export type SlotStatus = 'available' | 'limited' | 'full';

export interface TimeSlot {
  time: string;
  status: SlotStatus;
}

export const mockAvailability: Record<string, TimeSlot[]> = {
  default: [
    { time: "12:00 PM", status: "available" },
    { time: "1:00 PM", status: "available" },
    { time: "2:00 PM", status: "full" },
    { time: "7:00 PM", status: "limited" },
    { time: "8:00 PM", status: "available" },
    { time: "9:00 PM", status: "full" },
    { time: "10:00 PM", status: "available" }
  ],
  weekend: [
    { time: "12:00 PM", status: "limited" },
    { time: "1:00 PM", status: "full" },
    { time: "2:00 PM", status: "full" },
    { time: "7:00 PM", status: "full" },
    { time: "8:00 PM", status: "limited" },
    { time: "9:00 PM", status: "full" },
    { time: "10:00 PM", status: "limited" }
  ]
};

export function getMockAvailability(dateStr: string): TimeSlot[] {
  try {
    const d = new Date(dateStr);
    const day = d.getDay();
    if (day === 0 || day === 6) {
      return mockAvailability.weekend;
    }
  } catch (e) {
    // ignore
  }
  return mockAvailability.default;
}
