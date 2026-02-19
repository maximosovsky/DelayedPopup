<div align="center">

# 💬 DelayedPopup

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-96%25-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-CC_BY--SA_4.0-lightgrey?style=for-the-badge)

**Chat-like popup that converts visitors into customers — one widget, zero friction**

</div>

> 💡 People ignore banners. They don't ignore messages. DelayedPopup disguises your offer as an Intercom-style chat — appearing at the right moment with a product card and one-click Stripe payment.

<div align="center">
  <img src="DelayedPopup.jpg" width="200" alt="DelayedPopup preview">
  <br><br>
  <a href="#-quick-start">Quick Start</a> · <a href="#-features">Features</a> · <a href="ARCHITECTURE.md">Architecture</a> · <a href="popup-widget-package/README.md">Widget Docs</a>
</div>

---

## 💡 Concept

> A floating chat button bounces in the corner. After a configurable delay, a popup slides up — looking exactly like an Intercom message from a real person. Inside: a product offer with image, pricing, discount, and a Stripe payment button. The visitor pays without leaving the page.

The entire flow — from attention grab to payment — happens in **3 clicks** and **under 10 seconds**.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 💬 **Animated Chat Button** | Purple bubble with periodic bounce animation (every 5s) |
| 🎨 **Intercom-Style UI** | Avatar, online status, product card, fake message input |
| 💳 **Stripe Payments** | PaymentIntents API with automatic 3D Secure support |
| 🧪 **Mock Mode** | Full dev experience without a Stripe account |
| 🍪 **Cookie Control** | Show once per N days — no popup fatigue |
| ⏱ **Delayed Trigger** | Configurable timeout before popup appears |
| 📦 **Widget Package** | Export as standalone npm package for any React app |
| 📱 **Responsive** | Works on desktop and mobile |
| ♿ **Accessible** | Escape to close, click-outside, focus management |

---

## 🚀 Quick Start

```bash
git clone https://github.com/maximosovsky/DelayedPopup.git
cd DelayedPopup && npm install
cp .env.example .env && npm run dev
```

Open **http://localhost:5000** → popup appears after 2 seconds.

<details>
<summary>🔧 Advanced Setup</summary>

### Prerequisites

- **Node.js** 18+
- **npm** 9+
- (Optional) Stripe account for real payments
- (Optional) Neon PostgreSQL for persistent popup configs

### Production Build

```bash
npm run build     # Vite (client) + esbuild (server)
npm start         # Serve production bundle
```

### Database

```bash
# Set DATABASE_URL in .env, then:
npm run db:push   # Push Drizzle schema to Neon PostgreSQL
```

</details>

<details>
<summary>🔐 Environment Variables</summary>

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `STRIPE_SECRET_KEY` | For real payments | — | Stripe secret key (`sk_test_...`) |
| `VITE_STRIPE_PUBLIC_KEY` | For real payments | — | Stripe publishable key (`pk_test_...`) |
| `STRIPE_MOCK` | No | `true` | Mock Stripe on server |
| `VITE_STRIPE_MOCK` | No | `true` | Mock Stripe on client |

> 💡 Default `.env.example` works out of the box with mocked Stripe.

</details>

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 · TypeScript · TailwindCSS · shadcn/ui (Radix) |
| **Backend** | Express 4 · Node.js · Drizzle ORM |
| **Database** | Neon PostgreSQL (serverless) |
| **Payments** | Stripe PaymentIntents API |
| **Animation** | Framer Motion · TailwindCSS Animate |
| **Build** | Vite 5 · esbuild |
| **Routing** | Wouter |

```
DelayedPopup/
├── client/src/
│   ├── components/
│   │   ├── PopUp.tsx            # Intercom-style popup UI
│   │   ├── PaymentButton.tsx    # Stripe Elements + mock
│   │   └── ChatButton.tsx       # Floating animated bubble
│   ├── contexts/
│   │   └── PopUpContext.tsx     # State + cookies + content
│   ├── pages/
│   │   └── home.tsx             # Demo page
│   └── lib/
│       └── cookie.ts            # Cookie utilities
├── server/
│   ├── index.ts                 # Express setup
│   └── routes.ts                # POST /api/create-payment-intent
├── shared/
│   └── schema.ts                # Users + popup_configurations
└── popup-widget-package/        # Standalone widget export
```

---

## 📦 Widget Package

Drop the popup into any React app — no backend changes needed:

```bash
npm install ./popup-widget-package
```

```tsx
import { PopUpProvider, ChatButton, PopUp } from '@delayed-popup/widget';

<PopUpProvider>
  <YourApp />
  <ChatButton />
  <PopUp title="Special Offer!" price="$99" discount="$160" amount={9900} />
</PopUpProvider>
```

📖 Full guide: [Widget README](popup-widget-package/README.md) · [Integration Guide](popup-widget-package/INTEGRATION_GUIDE.md)

---

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server on port 5000 |
| `npm run dev:mock` | Dev with mocked Stripe |
| `npm run build` | Production build |
| `npm start` | Run production |
| `npm run check` | TypeScript check |
| `npm run db:push` | Push DB schema |

---

## 🗺️ Roadmap

- [ ] Webhook verification for payment confirmation
- [ ] A/B testing for popup timing and content
- [ ] Analytics dashboard (conversion rates)
- [ ] Multiple popup templates
- [ ] Exit-intent trigger (besides timer)

---

## 🤝 Contributing

1. Fork → `git checkout -b feature/name` → commit → PR
2. Follow existing code style (TypeScript strict, Tailwind classes)
3. Test with `npm run check` before submitting

---

## 📄 License

[Maxim Osovsky](https://www.linkedin.com/in/osovsky/). Licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
