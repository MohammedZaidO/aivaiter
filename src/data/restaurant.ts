export const restaurantConfig = {
  name: "Saffron Table",
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
    keywords: ["cuisine", "menu", "food", "serve", "dish"],
    answer: `We serve delicious ${restaurantConfig.cuisine}.`,
  },
  {
    keywords: ["contact", "phone", "number", "email", "call", "reach"],
    answer: `You can reach us at ${restaurantConfig.contactPhone} or email us at ${restaurantConfig.contactEmail}.`,
  },
];
