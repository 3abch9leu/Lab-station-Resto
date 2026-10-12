// Only real, publicly available review excerpts with correct attribution.
// Do NOT invent testimonials. Ratings/count configurable via restaurant.ts.
export interface Review {
  author: string;
  rating: number;
  date: string;
  text: string;
  source: string;
}

export const REVIEWS: Review[] = [
  {
    author: "Google review",
    rating: 5,
    date: "2025-11-20",
    text: "The Burger Texas, ribs, and brisket tacos are on another level! Incredible flavors, super juicy.",
    source: "Google Maps",
  },
  {
    author: "Google review",
    rating: 5,
    date: "2026-01-07",
    text: "I tried two burgers: the crispy chicken, which was amazing, and the brisket, which was also good. Very tasty, high-quality food overall.",
    source: "Google Maps",
  },
  {
    author: "Google review",
    rating: 5,
    date: "2026-01-22",
    text: "Tried it so many times and always has been great. I highly recommend the ribs or the brisket burger.",
    source: "Google Maps",
  },
  {
    author: "Google review",
    rating: 5,
    date: "2025-11-11",
    text: "The burgers and tacos at Lab Station are the best! The meat tastes fresh and real. Definitely one of the top spots in Tunis.",
    source: "Google Maps",
  },
];
