import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useElements, useStripe, PaymentElement, Elements } from "@stripe/react-stripe-js";
import { Button } from "./ui/button";
import { Dialog, DialogContent } from "./ui/dialog";

interface PaymentButtonProps {
  amount: number;
  buttonRef?: React.RefObject<HTMLButtonElement>;
  stripePublicKey?: string;
  apiEndpoint?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

interface CheckoutFormProps {
  onSuccess: () => void;
  onError?: (error: string) => void;
}

function CheckoutForm({ onSuccess, onError }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
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
      onError?.(error.message || "Payment failed");
    } else {
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

export default function PaymentButton({ 
  amount, 
  buttonRef, 
  stripePublicKey,
  apiEndpoint = "/api/create-payment-intent",
  onSuccess,
  onError
}: PaymentButtonProps) {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMockPayment, setIsMockPayment] = useState(false);
  const [stripePromise, setStripePromise] = useState<any>(null);

  const handlePayClick = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to create payment intent");
      }

      const data = await res.json();
      setClientSecret(data.clientSecret);
      setIsMockPayment(Boolean(data.mock));
      
      if (!isMockPayment && stripePublicKey && !stripePromise) {
        setStripePromise(loadStripe(stripePublicKey));
      }
      
      setShowPaymentDialog(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to initialize payment";
      onError?.(errorMessage);
      console.error("Error creating payment intent:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentDialog(false);
    onSuccess?.();
  };

  const handlePaymentError = (error: string) => {
    onError?.(error);
  };

  return (
    <>
      <Button 
        ref={buttonRef}
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

      <Dialog 
        open={showPaymentDialog} 
        onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-md" 
          aria-describedby="payment-dialog-description">
          <h2 className="text-xl font-bold sr-only" id="payment-dialog-title">Complete your payment</h2>
          <p id="payment-dialog-description" className="sr-only">
            Payment information form
          </p>
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Complete your payment</h2>
            {isMockPayment ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Stripe is mocked in this environment. Click below to simulate a successful payment.
                </p>
                <Button
                  type="button"
                  className="w-full rounded-full"
                  onClick={handlePaymentSuccess}
                >
                  Simulate payment
                </Button>
              </div>
            ) : clientSecret && stripePromise ? (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm onSuccess={handlePaymentSuccess} onError={handlePaymentError} />
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
