export const RESTAURANT = {
  name: "LAB STATION",
  tagline: "ENGINEERED FOR CRAVINGS",
  altTagline: "WHERE FLAVOR MEETS THE LAB",
  categoriesLine: "BURGERS • TACOS • SMOKED MEATS",
  address: {
    street: "Avenue Hédi Nouira",
    city: "Ariana",
    country: "Tunisia",
    plusCode: "V545+79Q",
    full: "Avenue Hédi Nouira, Ariana, Tunisia",
  },
  // Two landlines published by the restaurant.
  phones: [
    { label: "+216 50 708 979", tel: "+21650708979", whatsapp: "21650708979" },
    { label: "+216 50 708 879", tel: "+21650708879", whatsapp: "21650708879" },
  ],
  phone: "+216 50 708 979",
  phoneHref: "tel:+21650708979",
  phone2: "+216 50 708 879",
  phone2Href: "tel:+21650708879",
  whatsapp: "21650708979",
  email: "labstation.food@gmail.com",
  // Configurable — update when Google listing changes
  rating: 4.5,
  reviewCount: 2394,
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Lab+Station+Avenue+H%C3%A9di+Nouira+Ariana+Tunisia",
  directionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=Lab+Station+Avenue+H%C3%A9di+Nouira+Ariana+Tunisia",
  reviewsUrl:
    "https://www.google.com/maps/search/?api=1&query=Lab+Station+Avenue+H%C3%A9di+Nouira+Ariana+Tunisia",
  priceNote:
    "Prix vérifiés depuis le menu public le plus récent (2026). Confirmés sous réserve du restaurant.",
  currency: "DT",
} as const;

export const SOCIALS = {
  // Only verified accounts. Add URLs when confirmed by the restaurant.
  facebook: "https://www.facebook.com/p/Lab-Station-61566080255076/",
  instagram: "",
  tiktok: "",
} as const;
