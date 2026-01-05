import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { loadStripe } from "@stripe/stripe-js";
import { useElements, useStripe, PaymentElement, Elements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// Make sure to call `loadStripe` outside of a component's render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "");

interface PaymentButtonProps {
  amount: number;
}

function CheckoutForm({ onSuccess }: { onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin,
      },
      redirect: "if_required",
    });

    if (error) {
      toast({
        title: "Payment Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: "Thank you for your payment!",
      });
      onSuccess();
    }
    
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <Button 
        type="submit" 
        className="w-full rounded-full" 
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? "Processing..." : "Complete payment"}
      </Button>
    </form>
  );
}

export default function PaymentButton({ amount }: PaymentButtonProps) {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePayClick = async () => {
    setIsLoading(true);
    try {
      const res = await apiRequest("POST", "/api/create-payment-intent", { amount });
      const data = await res.json();
      setClientSecret(data.clientSecret);
      setShowPaymentDialog(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
      console.error("Error creating payment intent:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentDialog(false);
  };

  return (
    <>
      <Button 
        onClick={handlePayClick} 
        className="w-full rounded-lg bg-primary hover:bg-primary/90 font-semibold py-8 text-base animate-pulse-button shadow-md flex flex-col items-center"
        disabled={isLoading}
      >
        <span className="pb-0.5">{isLoading ? "Loading..." : "No time to waste! Handle it for me!"}</span>
        <div className="flex items-center text-xs mt-0 mb-2 opacity-80">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Secure payment via Stripe
        </div>
      </Button>

      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-md" 
          aria-describedby="payment-dialog-description">
          <h2 className="text-xl font-bold sr-only" id="payment-dialog-title">Complete your payment</h2>
          <p id="payment-dialog-description" className="sr-only">
            Payment information form
          </p>
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Complete your payment</h2>
            {clientSecret ? (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm onSuccess={handlePaymentSuccess} />
              </Elements>
            ) : (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
