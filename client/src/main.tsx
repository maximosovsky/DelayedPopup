import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Check if Stripe API key exists
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  console.warn("Missing VITE_STRIPE_PUBLIC_KEY. Please set it to enable payments.");
}

createRoot(document.getElementById("root")!).render(<App />);
