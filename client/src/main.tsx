import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const stripeMockEnabled = import.meta.env.VITE_STRIPE_MOCK === "true";

// Check if Stripe API key exists
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY && !stripeMockEnabled) {
  console.warn("Missing VITE_STRIPE_PUBLIC_KEY. Please set it to enable payments.");
}

createRoot(document.getElementById("root")!).render(<App />);
