# Give Me A Break — Waitlist (Next.js + Tailwind)

Deploy to Vercel and map to your domain while the main app is in staging.

## Setup
npm i
npm run dev

## Form endpoint (Formspree)
Add env var in Vercel:
NEXT_PUBLIC_FORMSPREE_ENDPOINT = https://formspree.io/f/XXXXXX
Redeploy, then submit the form to test.

## Domain
Add `waitlist.givemeabreak.com.au` in Vercel.
DNS: `CNAME waitlist → cname.vercel-dns.com`.
