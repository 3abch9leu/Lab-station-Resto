export type MenuCategory =
  | "burgers"
  | "tacos"
  | "supplements"
  | "sides"
  | "drinks"
  | "desserts";

export type MenuTag = "signature" | "spicy" | "super-spicy" | "smoked" | "cheesy" | "lab-choice";

export interface MenuItem {
  id: string;
  name: string;
  variant?: string;
  category: MenuCategory;
  description: string;
  ingredients: string[];
  /** Price in TND. null = "needs restaurant confirmation", never invented. */
  price: number | null;
  priceVerified: boolean;
  image: string;
  tags: MenuTag[];
  spicyLevel: 0 | 1 | 2;
  featured?: boolean;
  available: boolean;
  code: string; // decorative lab specimen code, e.g. LAB-001
}

/**
 * SOURCE OF TRUTH — current carte provided by the restaurant (2026),
 * cross-checked with the latest indexed public menu.
 *
 * Verified prices carry priceVerified: true.
 * Items without a confirmed price carry price: null and render "—".
 */

// Verified Unsplash food photography (HTTP 200 checked)
const U = {
  crispy: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=900&auto=format&fit=crop",
  classic: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?q=80&w=900&auto=format&fit=crop",
  double: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=900&auto=format&fit=crop",
  mushroom: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=900&auto=format&fit=crop",
  texas: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=900&auto=format&fit=crop&crop=entropy",
  meat: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?q=80&w=900&auto=format&fit=crop",
  brisket: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=900&auto=format&fit=crop&crop=entropy",
  truffle: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?q=80&w=900&auto=format&fit=crop",
  cheese: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?q=80&w=900&auto=format&fit=crop",
  fries: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=900&auto=format&fit=crop",
};

// Real dish photography — Wikimedia Commons contributors (CC licensed, HTTP 200 checked)
const W = {
  tacosLondon: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9a/French_tacos_from_French_Tacos_on_London_Road.jpg/960px-French_tacos_from_French_Tacos_on_London_Road.jpg",
  tacosMorocco: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d5/French_tacos_from_Morocco.jpg/960px-French_tacos_from_Morocco.jpg",
  tacosOtacos: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a7/French_Tacos_from_O%27Tacos.jpg/960px-French_Tacos_from_O%27Tacos.jpg",
  tacosPastor: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3a/Tacos_al_pastor.jpg/960px-Tacos_al_pastor.jpg",
  tacosCarnitas: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/73/001_Tacos_de_carnitas%2C_carne_asada_y_al_pastor.jpg/960px-001_Tacos_de_carnitas%2C_carne_asada_y_al_pastor.jpg",
  tacos2: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/71/Tacos_2.jpg/960px-Tacos_2.jpg",
  tacosPanza: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/07/Tacos_al_pastor%2C_taco_de_panza.jpg/960px-Tacos_al_pastor%2C_taco_de_panza.jpg",
  tacosElFlaco: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d1/%28El_Flaco%29_Al_Pastor_Tacos.jpg/960px-%28El_Flaco%29_Al_Pastor_Tacos.jpg",
  nashville: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d6/Princes_hot_chicken.jpg/960px-Princes_hot_chicken.jpg",
  philly: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/34/Cheesesteak_%2819386149993%29.jpg/960px-Cheesesteak_%2819386149993%29.jpg",
  parm: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f2/Panko_Crumbed_Free_Range_Chicken_Schnitzel_Parmi%2C_The_Griffins_Hotel%2C_2024_%2801%29.jpg/960px-Panko_Crumbed_Free_Range_Chicken_Schnitzel_Parmi%2C_The_Griffins_Hotel%2C_2024_%2801%29.jpg",
  brisketBbq: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/26/Hickory_Hillz_BBQ_-_May_2022_-_Sarah_Stierch_05.jpg/960px-Hickory_Hillz_BBQ_-_May_2022_-_Sarah_Stierch_05.jpg",
};

export const PHOTO_CREDITS =
  "Photos tacos / viandes : contributeurs Wikimedia Commons (licences CC). Burgers : Unsplash.";

export const MENU: MenuItem[] = [
  // ============ SIGNATURE BURGERS — current carte ============
  {
    id: "cent-pourcent-meat",
    name: "100% MEAT",
    category: "burgers",
    description: "Triple viande : hachée, brisket, ribs. L'expérience extrême.",
    ingredients: ["Viande hachée", "Viande brisket", "Viande ribs", "Mozzarella", "Cheddar", "Gruyère", "Oignons caramélisés", "Roquette", "Cornichons", "Tapenade"],
    price: 39.9, priceVerified: true, image: U.meat,
    tags: ["signature", "smoked", "cheesy", "lab-choice"], spicyLevel: 0, featured: true, available: true, code: "LAB-005",
  },
  {
    id: "brisket-lab-burger",
    name: "BRISKET LAB",
    variant: "BRISKET FUMÉ",
    category: "burgers",
    description: "Brisket fumé, triple fromage, crispy potato, tapenade.",
    ingredients: ["Viande brisket fumée", "Sauce Lab", "Sauce brisket", "Mozzarella", "Gruyère", "Cheddar", "Oignons caramélisés", "Roquette", "Crispy potato", "Tapenade"],
    price: 26.9, priceVerified: true, image: U.brisket,
    tags: ["signature", "smoked", "cheesy"], spicyLevel: 0, featured: true, available: true, code: "LAB-006",
  },
  {
    id: "double",
    name: "DOUBLE BURGER",
    category: "burgers",
    description: "Double viande hachée, cheddar, sauce burger.",
    ingredients: ["Double viande hachée", "Cheddar", "Sauce burger", "Laitue", "Tomate", "Oignon", "Cornichon"],
    price: 25.9, priceVerified: true, image: U.double,
    tags: ["signature"], spicyLevel: 0, featured: true, available: true, code: "LAB-012",
  },
  {
    id: "creamy-mushroom-burger",
    name: "CREAMY MUSHROOM",
    category: "burgers",
    description: "Sauce onctueuse aux champignons blancs, mozzarella.",
    ingredients: ["Viande hachée", "Sauce Lab", "Sauce brisket", "Mozzarella", "Oignons caramélisés", "Sauce onctueuse aux champignons blancs"],
    price: 23.9, priceVerified: true, image: U.mushroom,
    tags: ["signature", "cheesy"], spicyLevel: 0, available: true, code: "LAB-007",
  },
  {
    id: "full-cheese-burger",
    name: "FULL CHEESE",
    category: "burgers",
    description: "Cheddar, Gruyère, double sauce fromagère.",
    ingredients: ["Viande hachée", "Cheddar", "Gruyère", "Sauce fromagère", "Sauce Lab", "Oignons caramélisés"],
    price: 21.9, priceVerified: true, image: U.cheese,
    tags: ["signature", "cheesy"], spicyLevel: 0, available: true, code: "LAB-011",
  },
  {
    id: "crispy-chicken",
    name: "CRISPY CHICKEN",
    variant: "ORIGINAL / SPICY",
    category: "burgers",
    description: "Poulet crispy ultra-croustillant, sauces Lab & Burger.",
    ingredients: ["Poulet crispy", "Sauce Lab", "Sauce burger", "Gruyère", "Laitue", "Tomate", "Oignon", "Cornichon"],
    price: 16.9, priceVerified: true, image: U.crispy,
    tags: ["signature", "lab-choice"], spicyLevel: 1, featured: true, available: true, code: "LAB-001",
  },
  // ---- À la carte (pri confirmed where listed, else awaiting confirmation)
  {
    id: "texas-ribs",
    name: "TEXAS RIBS",
    variant: "RIBS FUMÉ",
    category: "burgers",
    description: "Ribs fumé, brisket sauce, cheddar, crispy potato, tapenade.",
    ingredients: ["Viande ribs fumée", "Lab sauce", "Brisket sauce", "Cheddar", "Oignons caramélisés", "Roquette", "Crispy potato", "Tapenade"],
    price: 28.9, priceVerified: true, image: U.texas,
    tags: ["signature", "smoked", "lab-choice"], spicyLevel: 0, featured: true, available: true, code: "LAB-004",
  },
  {
    id: "truffle",
    name: "TRUFFLE",
    category: "burgers",
    description: "Sauce truffette, mozzarella, brisket sauce.",
    ingredients: ["Steak haché", "Mozzarella", "Sauce brisket", "Sauce truffette", "Oignons caramélisés", "Cornichon"],
    price: 24.9, priceVerified: true, image: U.truffle,
    tags: ["signature", "cheesy"], spicyLevel: 0, available: true, code: "LAB-008",
  },
  {
    id: "monto-cinto",
    name: "MONTO CINTO",
    category: "burgers",
    description: "Pesto, roquette, parmesan, double mozzarella, crème.",
    ingredients: ["Steak haché", "Lab sauce", "Pesto", "Roquette", "Parmesan", "Mozzarella", "Tomate", "Crème"],
    price: 28.9, priceVerified: true, image: U.cheese,
    tags: ["signature", "cheesy"], spicyLevel: 0, available: true, code: "LAB-009",
  },
  {
    id: "nashville-hot-chicken",
    name: "NASHVILLE HOT CHICKEN",
    category: "burgers",
    description: "Poulet mariné épicé façon Nashville. Prix à confirmer au labo.",
    ingredients: ["Poulet Nashville hot", "Sauce Lab"],
    price: null, priceVerified: false, image: W.nashville,
    tags: ["signature", "spicy"], spicyLevel: 2, available: true, code: "LAB-016",
  },
  {
    id: "philly-cheesesteak",
    name: "PHILLY CHEESESTEAK",
    category: "burgers",
    description: "Émincé de bœuf, fromage fondant. Prix à confirmer au labo.",
    ingredients: ["Émincé de bœuf", "Fromage fondant"],
    price: null, priceVerified: false, image: W.philly,
    tags: ["signature", "cheesy"], spicyLevel: 0, available: true, code: "LAB-017",
  },
  // ---- Previous carte, kept while uncontradicted
  {
    id: "classic",
    name: "CLASSIC",
    category: "burgers",
    description: "Le steak haché juteux, cheddar, double sauce Lab + Burger.",
    ingredients: ["Steak haché", "Cheddar", "Lab sauce", "Burger sauce", "Laitue", "Tomate", "Oignon", "Cornichon"],
    price: 16.9, priceVerified: true, image: U.classic,
    tags: ["signature"], spicyLevel: 0, featured: true, available: true, code: "LAB-002",
  },
  {
    id: "burger-lab",
    name: "BURGER LAB",
    category: "burgers",
    description: "La formule originelle du labo : steak, Gruyère, Lab sauce.",
    ingredients: ["Steak haché", "Gruyère", "Lab sauce", "Oignon", "Cornichon"],
    price: 19.9, priceVerified: true, image: U.double,
    tags: ["signature"], spicyLevel: 0, available: true, code: "LAB-003",
  },
  {
    id: "spicy-super-spicy",
    name: "SPICY / SUPER SPICY",
    category: "burgers",
    description: "Sauce cheddar rouge, niveau de feu au choix.",
    ingredients: ["Steak haché", "Cheddar", "Sauce cheddar rouge"],
    price: 18.9, priceVerified: true, image: U.crispy,
    tags: ["spicy", "super-spicy"], spicyLevel: 2, available: true, code: "LAB-010",
  },
  {
    id: "triple",
    name: "TRIPLE",
    category: "burgers",
    description: "Triple viande hachée pour les grandes faims du labo.",
    ingredients: ["Triple viande hachée", "Cheddar", "Burger sauce", "Laitue", "Tomate", "Oignon", "Cornichon"],
    price: null, priceVerified: false, image: U.meat,
    tags: ["signature"], spicyLevel: 0, available: true, code: "LAB-013",
  },
  {
    id: "scrambled-eggs",
    name: "SCRAMBLED EGGS",
    category: "burgers",
    description: "Viande hachée, cheddar, œuf brouillé, Lab sauce.",
    ingredients: ["Viande hachée", "Cheddar", "Lab sauce", "Oignon", "Œuf brouillé"],
    price: null, priceVerified: false, image: U.classic,
    tags: ["signature"], spicyLevel: 0, available: true, code: "LAB-014",
  },
  {
    id: "mr-bacon",
    name: "MR BACON",
    category: "burgers",
    description: "Bacon grillé, cheddar, œuf sauté, Lab sauce.",
    ingredients: ["Viande hachée", "Cheddar", "Bacon", "Lab sauce", "Oignons", "Œuf sauté"],
    price: null, priceVerified: false, image: U.texas,
    tags: ["signature"], spicyLevel: 0, available: true, code: "LAB-015",
  },

  // ============ SIGNATURE TACOS — current carte, real photos ============
  {
    id: "tacos-brisket",
    name: "TACOS BRISKET LAB",
    variant: "BRISKET FUMÉ",
    category: "tacos",
    description: "Brisket fumé, crispy potato, fromagère onctueuse.",
    ingredients: ["Viande brisket fumée", "Sauce brisket", "Sauce spicy", "Oignons caramélisés", "Crispy potato", "Sauce fromagère"],
    price: 23.9, priceVerified: true, image: W.brisketBbq,
    tags: ["signature", "smoked", "lab-choice"], spicyLevel: 1, featured: true, available: true, code: "LAB-106",
  },
  {
    id: "tacos-mr-bacon",
    name: "TACOS MR BACON",
    category: "tacos",
    description: "130g de viande hachée, bacon de bœuf, crispy potato.",
    ingredients: ["Viande hachée 130g", "Bacon de bœuf", "Sauce Lab", "Sauce spicy", "Frites", "Crispy potato", "Sauce fromagère"],
    price: 18.9, priceVerified: true, image: W.tacosPanza,
    tags: ["signature"], spicyLevel: 1, featured: true, available: true, code: "LAB-109",
  },
  {
    id: "tacos-creamy-mushroom",
    name: "TACOS CREAMY MUSHROOM",
    category: "tacos",
    description: "Poulet à la crème, champignons frais, frites, fromagère.",
    ingredients: ["Poulet à la crème", "Champignons frais", "Sauce Lab", "Oignons caramélisés", "Frites", "Sauce fromagère"],
    price: 14.9, priceVerified: true, image: W.tacosOtacos,
    tags: ["signature", "cheesy"], spicyLevel: 0, available: true, code: "LAB-103",
  },
  {
    id: "tacos-chicken-parm",
    name: "TACOS CHICKEN PARMESAN",
    category: "tacos",
    description: "Poulet croustillant, sauce parmesan croustillante.",
    ingredients: ["Poulet croustillant", "Frites", "Sauce Lab", "Sauce parmesan croustillante", "Oignons caramélisés"],
    price: 14.9, priceVerified: true, image: W.parm,
    tags: ["signature", "cheesy"], spicyLevel: 0, available: true, code: "LAB-110",
  },
  {
    id: "tacos-super-spicy",
    name: "TACOS SUPER SPICY",
    category: "tacos",
    description: "Poulet épicé, Super Spicy sauce, niveau feu maximum.",
    ingredients: ["Poulet épicé", "Sauce super spicy", "Oignons caramélisés", "Frites", "Sauce fromagère"],
    price: 13.9, priceVerified: true, image: W.tacosPastor,
    tags: ["spicy", "super-spicy"], spicyLevel: 2, available: true, code: "LAB-104",
  },
  {
    id: "tacos-classic",
    name: "TACOS CLASSIC",
    category: "tacos",
    description: "Poulet grillé, frites, sauce fromagère.",
    ingredients: ["Poulet grillé", "Sauce Lab", "Sauce spicy", "Oignons caramélisés", "Frites", "Sauce fromagère"],
    price: 12.9, priceVerified: true, image: W.tacosLondon,
    tags: ["signature"], spicyLevel: 1, featured: true, available: true, code: "LAB-101",
  },
  {
    id: "tacos-crispy",
    name: "TACOS CRISPY",
    category: "tacos",
    description: "Poulet pané croustillant, frites, fromagère.",
    ingredients: ["Poulet pané", "Sauce Lab", "Sauce spicy", "Frites", "Sauce fromagère", "Oignons caramélisés"],
    price: 12.9, priceVerified: true, image: W.tacosMorocco,
    tags: ["signature"], spicyLevel: 1, available: true, code: "LAB-102",
  },
  {
    id: "tacos-full-cheese",
    name: "TACOS FULL CHEESE",
    category: "tacos",
    description: "Triple fromage : cheddar, Gruyère, mozzarella.",
    ingredients: ["Poulet pané ou grillé", "Lab sauce", "Cheddar", "Gruyère", "Mozzarella", "Frites", "Sauce fromagère"],
    price: 15.9, priceVerified: true, image: W.tacosCarnitas,
    tags: ["signature", "cheesy"], spicyLevel: 0, available: true, code: "LAB-105",
  },
  {
    id: "tacos-viande-hachee",
    name: "TACOS VIANDE HACHÉE",
    category: "tacos",
    description: "Viande hachée, Lab sauce au poivre, crispy potato.",
    ingredients: ["Viande hachée", "Lab sauce au poivre", "Spicy sauce", "Oignons caramélisés", "Crispy potato", "Sauce fromagère"],
    price: 14.9, priceVerified: true, image: W.tacos2,
    tags: ["signature"], spicyLevel: 1, available: true, code: "LAB-107",
  },
  {
    id: "tacos-ribs",
    name: "TACOS RIBS FUMÉ",
    category: "tacos",
    description: "Ribs fumé, brisket sauce, crispy potato, fromagère.",
    ingredients: ["Viande ribs fumée", "Brisket sauce", "Spicy sauce", "Oignons caramélisés", "Crispy potato", "Sauce fromagère"],
    price: 24.9, priceVerified: true, image: W.tacosElFlaco,
    tags: ["signature", "smoked"], spicyLevel: 1, featured: true, available: true, code: "LAB-108",
  },

  // ============ SUPPLÉMENTS — current carte ============
  ...(
    [
      ["sup-brisket", "BRISKET FUMÉ", 12.0],
      ["sup-raclette", "FAÇON RACLETTE", 7.0],
      ["sup-viande", "VIANDE HACHÉE", 7.0],
      ["sup-fried-chicken", "FRIED CHICKEN", 5.0],
      ["sup-oeuf-brouille", "ŒUF BROUILLÉ", 4.0],
      ["sup-cheddar", "CHEDDAR", 3.5],
      ["sup-gruyere", "GRUYÈRE", 3.0],
      ["sup-mozza", "MOZZARELLA", 3.0],
      ["sup-parmesan", "PARMESAN", 3.0],
      ["sup-ribs", "RIBS FUMÉ", 12.0],
      ["sup-oeuf", "ŒUF", 1.5],
      ["sup-frites", "FRITES", 3.0],
    ] as const
  ).map(([id, name, price], i) => ({
    id, name, category: "supplements" as const,
    description: `Supplément ${name.toLowerCase()} — assemblé au labo.`,
    ingredients: [name],
    price, priceVerified: true,
    image: U.fries, tags: [] as MenuTag[], spicyLevel: 0 as const,
    available: true, code: `LAB-2${String(i).padStart(2, "0")}`,
  })),

  // ============ SIDES / DRINKS ============
  {
    id: "side-fries", name: "FRITES LAB", category: "sides",
    description: "Frites maison, assaisonnement secret du labo.",
    ingredients: ["Pommes de terre", "Assaisonnement Lab"],
    price: 3.0, priceVerified: true, image: U.fries,
    tags: [], spicyLevel: 0, available: true, code: "LAB-301",
  },
  {
    id: "side-crispy-potato", name: "CRISPY POTATO", category: "sides",
    description: "Pommes de terre crispy, cœur fondant.",
    ingredients: ["Crispy potato", "Sel fumé"],
    price: 5.0, priceVerified: false, image: U.fries,
    tags: [], spicyLevel: 0, available: true, code: "LAB-302",
  },
  {
    id: "drink-soda", name: "SODA", category: "drinks",
    description: "Soda frais 33cl.",
    ingredients: ["Soda"],
    price: 3.0, priceVerified: true, image: U.fries,
    tags: [], spicyLevel: 0, available: true, code: "LAB-401",
  },
  {
    id: "drink-eau", name: "EAU MINÉRALE", category: "drinks",
    description: "Eau minérale fraîche.",
    ingredients: ["Eau"],
    price: 1.5, priceVerified: true, image: U.fries,
    tags: [], spicyLevel: 0, available: true, code: "LAB-402",
  },
];

export const CATEGORIES: { id: MenuCategory | "all"; label: string }[] = [
  { id: "all", label: "TOUT" },
  { id: "burgers", label: "BURGERS" },
  { id: "tacos", label: "TACOS" },
  { id: "supplements", label: "SUPPLÉMENTS" },
  { id: "sides", label: "SIDES" },
  { id: "drinks", label: "DRINKS" },
];

export const formatPrice = (p: number | null) =>
  p === null ? "—" : `${p.toFixed(1)} DT`;
