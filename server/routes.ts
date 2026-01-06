import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import Stripe from "stripe";

const stripeMockEnabled = process.env.STRIPE_MOCK === "true";

if (!process.env.STRIPE_SECRET_KEY && !stripeMockEnabled) {
  console.warn("Missing required Stripe secret: STRIPE_SECRET_KEY");
}

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
    })
  : null;

export async function registerRoutes(app: Express): Promise<Server> {
  // Stripe payment route for one-time payments
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount } = req.body;
      
      if (!amount || typeof amount !== 'number') {
        return res.status(400).json({ 
          message: "Invalid amount. Please provide a valid number." 
        });
      }

      if (!stripe) {
        if (!stripeMockEnabled) {
          return res.status(500).json({
            message: "Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable."
          });
        }
        return res.json({
          clientSecret: `pi_mock_secret_${Date.now()}`,
          mock: true,
        });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount, // The amount is already in cents
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.json({ 
        clientSecret: paymentIntent.client_secret 
      });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res
        .status(500)
        .json({ 
          message: "Error creating payment intent: " + error.message 
        });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
