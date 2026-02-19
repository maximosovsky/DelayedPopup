# DelayedPopup

Intercom-style delayed popup widget with Stripe payment integration. Appears as a chat bubble that opens into a product offer with one-click payment — designed to boost conversions on any website.

## Features

- 💬 **Animated chat button** — bouncing purple bubble that attracts attention every 5 seconds
- 🎨 **Intercom-style popup** — modern chat-like UI with avatar, product image, pricing, and discount display
- 💳 **Stripe integration** — real payment processing via PaymentIntents + mock mode for development
- 🍪 **Cookie management** — configurable display frequency (show once per N days)
- ⏱ **Configurable delay** — popup appears after a set timeout
- 📦 **Standalone widget package** — export as npm package for integration into any React app

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, TailwindCSS, shadcn/ui (Radix) |
| **Backend** | Express, Node.js, Drizzle ORM (Neon PostgreSQL) |
| **Payments** | Stripe (PaymentIntents API) |
| **Animation** | Framer Motion, TailwindCSS Animate |
| **Build** | Vite, esbuild |

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/maximosovsky/DelayedPopup.git
cd DelayedPopup

# 2. Install dependencies
npm install

# 3. Copy env and configure
cp .env.example .env

# 4. Run in development (mock Stripe)
npm run dev

# 5. Open http://localhost:5000
```

The popup will appear 2 seconds after page load.

## Environment Variables

```env
# Stripe (required for real payments)
STRIPE_SECRET_KEY=sk_test_...
VITE_STRIPE_PUBLIC_KEY=pk_test_...

# Mock mode (no Stripe account needed)
STRIPE_MOCK=true
VITE_STRIPE_MOCK=true
```

## Project Structure

```
DelayedPopup/
├── client/src/
│   ├── components/
│   │   ├── PopUp.tsx          # Main popup UI (Intercom-style)
│   │   ├── PaymentButton.tsx  # Stripe payment flow
│   │   └── ChatButton.tsx     # Floating chat bubble
│   ├── contexts/
│   │   └── PopUpContext.tsx   # State & cookie management
│   ├── pages/
│   │   └── home.tsx           # Demo page
│   └── lib/
│       └── cookie.ts          # Cookie utilities
├── server/
│   ├── index.ts               # Express server
│   └── routes.ts              # Stripe PaymentIntent API
├── shared/
│   └── schema.ts              # DB schema (users + popup configs)
└── popup-widget-package/      # Standalone npm widget
    ├── README.md              # Integration guide
    └── src/                   # Widget source files
```

## Widget Package

The `popup-widget-package/` directory contains a standalone version that can be integrated into any React project:

```bash
npm install /path/to/popup-widget-package
```

See [popup-widget-package/README.md](popup-widget-package/README.md) for full integration docs.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (port 5000) |
| `npm run dev:mock` | Dev server with mocked Stripe |
| `npm run build` | Build for production |
| `npm start` | Run production build |
| `npm run check` | TypeScript type check |
| `npm run db:push` | Push Drizzle schema to DB |

## License

MIT
