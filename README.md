# LAB STATION — Food Laboratory (Ariana, Tunisia)

Premium Next.js site + real backend (Prisma + SQLite, zod-validated API,
scrypt admin sessions) for the Lab Station restaurant.

## Getting Started

First, set up the database (once):

```bash
npm install
npm run db:migrate   # creates prisma/dev.db, runs seed (39 menu items + admin)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Backend & Admin

- Public API: `GET /api/menu`, `POST /api/orders`, `GET /api/settings`
- Admin API (session cookie required): `/api/admin/*`, `/api/orders` (GET), `/api/orders/[id]` (PATCH)
- Dashboard: `/admin` — seeded user from `.env` (`ADMIN_USERNAME` / `ADMIN_PASSWORD`,
  defaults `labadmin` / `lab-admin-2026`). Change the password in `.env` + reseed,
  or add users via `prisma studio` (`npm run db:studio`).
- Passwords: scrypt + timing-safe compare. Sessions: DB tokens, httpOnly cookies.
  Set `COOKIE_SECURE=1` when serving HTTPS behind plain HTTP internally.
- Switching to Postgres: change `provider` in `prisma/schema.prisma`, set
  `DATABASE_URL`, run `npm run db:migrate`.
- The public site renders instantly from verified static data, then live-syncs
  menu, hours, promos and rating from the API.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
