import type { Metadata, Viewport } from "next";
import { Anton, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { RESTAURANT } from "@/data/restaurant";

const display = Anton({ variable: "--font-display", subsets: ["latin"], weight: "400", display: "swap" });
const body = Inter({ variable: "--font-body", subsets: ["latin"], display: "swap" });
const mono = JetBrains_Mono({ variable: "--font-mono-lab", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://labstation-ariana.tn"),
  title: {
    default: "LAB STATION — Burgers, Tacos & Smoked Meats | Ariana, Tunisia",
    template: "%s | LAB STATION Ariana",
  },
  description:
    "Lab Station — laboratoire culinaire sur l'Avenue Hédi Nouira, Ariana. Burgers signatures, tacos, brisket & ribs fumés. Engineered for cravings. ☎ +216 50 708 979",
  keywords: [
    "Lab Station Ariana", "Lab Station Tunisia", "Burger Ariana", "Burger Ennasr",
    "Tacos Ariana", "Restaurant Ariana", "Lab Station restaurant", "smoked brisket Tunis",
    "Texas ribs Ariana", "burger Tunis",
  ],
  authors: [{ name: "Lab Station" }],
  openGraph: {
    type: "website",
    locale: "fr_TN",
    siteName: "LAB STATION",
    title: "LAB STATION — Engineered for Cravings | Ariana",
    description: "Burgers signatures, tacos, brisket & ribs fumés. Avenue Hédi Nouira, Ariana. +216 50 708 979",
  },
  twitter: { card: "summary_large_image", title: "LAB STATION — Ariana", description: "Burgers • Tacos • Smoked Meats. Engineered for cravings." },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "Lab Station",
  servesCuisine: ["Burgers", "Tacos", "Smoked meats"],
  priceRange: "TND 10–40",
  telephone: RESTAURANT.phone,
  email: RESTAURANT.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: RESTAURANT.address.street,
    addressLocality: RESTAURANT.address.city,
    addressCountry: "TN",
  },
  aggregateRating: { "@type": "AggregateRating", ratingValue: RESTAURANT.rating, reviewCount: RESTAURANT.reviewCount },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Saturday", "Sunday"],
      opens: "12:00",
      closes: "01:00",
    },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Friday", opens: "14:00", closes: "01:00" },
  ],
  hasMenu: "#menu",
  url: "https://labstation-ariana.tn",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      </head>
      <body className="carbon min-h-full">
        <a href="#menu" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-[#ffd400] focus:px-5 focus:py-2 focus:font-bold focus:text-black">
          Aller au menu
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
