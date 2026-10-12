// Configurable opening hours — restaurant can edit via /admin.
// Source: latest public listing (12:00–01:00, Friday from 14:00). Confirm with restaurant.
export interface DayHours {
  day: string;
  open: string; // "12:00"
  close: string; // "01:00" (next day)
  closed?: boolean;
}

export const HOURS: DayHours[] = [
  { day: "Lundi", open: "12:00", close: "01:00" },
  { day: "Mardi", open: "12:00", close: "01:00" },
  { day: "Mercredi", open: "12:00", close: "01:00" },
  { day: "Jeudi", open: "12:00", close: "01:00" },
  { day: "Vendredi", open: "14:00", close: "01:00" },
  { day: "Samedi", open: "12:00", close: "01:00" },
  { day: "Dimanche", open: "12:00", close: "01:00" },
];

const toMin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

/** Computes OPEN NOW / CLOSED from configurable hours. Handles overnight close (01:00). */
export function getOpenStatus(now: Date = new Date()): { open: boolean; label: string; detail: string } {
  // JS: 0=Sunday..6=Saturday; HOURS index 0=Monday
  const jsDay = now.getDay();
  const idx = (jsDay + 6) % 7;
  const today = HOURS[idx];
  const mins = now.getHours() * 60 + now.getMinutes();
  const open = toMin(today.open);
  const close = toMin(today.close);

  let isOpen: boolean;
  if (close <= open) {
    // overnight: open if after open OR before close
    isOpen = mins >= open || mins < close;
  } else {
    isOpen = mins >= open && mins < close;
  }
  // Also check previous day overnight spill (e.g. 00:30 belongs to yesterday's service)
  if (!isOpen && mins < 600) {
    const prev = HOURS[(idx + 6) % 7];
    const pOpen = toMin(prev.open);
    const pClose = toMin(prev.close);
    if (pClose <= pOpen && mins < pClose) isOpen = true;
  }

  return {
    open: isOpen,
    label: isOpen ? "OPEN NOW" : "CLOSED",
    detail: isOpen
      ? `Ferme à ${today.close}`
      : `Ouvre à ${today.open}`,
  };
}
