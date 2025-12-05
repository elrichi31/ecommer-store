"use client"

import { isManual, isPaypal, isStripeLike } from "@lib/constants"
import { placeOrder } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { Button, toast } from "@medusajs/ui"
import { useElements, useStripe } from "@stripe/react-stripe-js"
import React, { useState, useEffect } from "react"
import ErrorMessage from "../error-message"

// Helper to check if error is a Next.js redirect (not a real error)
const isRedirectError = (error: any): boolean => {
  return error?.digest?.startsWith("NEXT_REDIRECT") || 
         error?.message?.includes("NEXT_REDIRECT") ||
         error?.name === "RedirectError"
}

type PaymentButtonProps = {
  cart: HttpTypes.StoreCart
  "data-testid": string
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  cart,
  "data-testid": dataTestId,
}) => {
  const notReady =
    !cart ||
    !cart.shipping_address ||
    !cart.billing_address ||
    !cart.email ||
    (cart.shipping_methods?.length ?? 0) < 1

  const paymentSession = cart.payment_collection?.payment_sessions?.[0]

  switch (true) {
    case isStripeLike(paymentSession?.provider_id):
      return (
        <StripePaymentButton
          notReady={notReady}
          cart={cart}
          data-testid={dataTestId}
        />
      )
    case isPaypal(paymentSession?.provider_id):
      return (
        <PayPalPaymentButton
          cart={cart}
          notReady={notReady}
          data-testid={dataTestId}
        />
      )
    case isManual(paymentSession?.provider_id):
      return (
        <ManualTestPaymentButton notReady={notReady} data-testid={dataTestId} />
      )
    default:
      return <Button disabled>Select a payment method</Button>
  }
}

const PayPalPaymentButton = ({
  cart,
  notReady,
  "data-testid": dataTestId,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [paypalLoaded, setPaypalLoaded] = useState(false)
  const [paypalButtonRendered, setPaypalButtonRendered] = useState(false)

  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )

  const paypalOrderId = session?.data?.id as string

  useEffect(() => {
    // Check if PayPal SDK is already loaded
    if ((window as any).paypal) {
      setPaypalLoaded(true)
      return
    }

    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
    if (!clientId) {
      setErrorMessage("PayPal client ID not configured")
      return
    }

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="paypal.com/sdk"]')
    if (existingScript) {
      setPaypalLoaded(true)
      return
    }

    const script = document.createElement("script")
    script.src = "https://www.paypal.com/sdk/js?client-id=" + clientId + "&currency=USD"
    script.async = true
    script.id = "paypal-sdk-script"
    script.onload = () => setPaypalLoaded(true)
    script.onerror = () => setErrorMessage("Failed to load PayPal SDK")
    document.body.appendChild(script)

    // Don't remove script on cleanup - PayPal SDK should persist
  }, [])

  const onPaymentCompleted = async () => {
    try {
      await placeOrder()
    } catch (err: any) {
      // Don't show error if it's a redirect (order was successful)
      if (!isRedirectError(err)) {
        setErrorMessage(err.message)
        toast.error("Error al procesar el pago con PayPal.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handlePayPalApprove = async () => {
    setSubmitting(true)
    await onPaymentCompleted()
  }

  useEffect(() => {
    if (!paypalLoaded || !paypalOrderId || paypalButtonRendered) return

    const paypalContainer = document.getElementById("paypal-button-container")
    if (!paypalContainer || !(window as any).paypal) return

    paypalContainer.innerHTML = ""

    ;(window as any).paypal
      .Buttons({
        createOrder: () => {
          return paypalOrderId
        },
        onApprove: async () => {
          await handlePayPalApprove()
        },
        onError: (err: any) => {
          setErrorMessage(err.message || "PayPal error")
          setSubmitting(false)
        },
        onCancel: () => {
          setSubmitting(false)
          toast.info("Pago cancelado")
        },
        style: {
          layout: "vertical",
          color: "gold",
          shape: "rect",
          label: "paypal",
        },
      })
      .render("#paypal-button-container")
      .then(() => setPaypalButtonRendered(true))
      .catch((err: any) => {
        console.error("PayPal button render error:", err)
        setErrorMessage("Error al cargar botón de PayPal")
      })
  }, [paypalLoaded, paypalOrderId, paypalButtonRendered])

  if (notReady) {
    return (
      <Button disabled size="large">
        Complete your information
      </Button>
    )
  }

  return (
    <>
      <div id="paypal-button-container" className="w-full min-h-[45px]">
        {!paypalLoaded && (
          <Button disabled isLoading size="large" className="w-full">
            Loading PayPal...
          </Button>
        )}
      </div>
      <ErrorMessage
        error={errorMessage}
        data-testid="paypal-payment-error-message"
      />
    </>
  )
}

const StripePaymentButton = ({
  cart,
  notReady,
  "data-testid": dataTestId,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    try {
      await placeOrder()
    } catch (err: any) {
      // Don't show error if it's a redirect (order was successful)
      if (!isRedirectError(err)) {
        setErrorMessage(err.message)
        toast.error("Error al procesar el pago. Inténtalo más tarde.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  const stripe = useStripe()
  const elements = useElements()
  const card = elements?.getElement("card")

  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )

  const disabled = !stripe || !elements ? true : false

  const handlePayment = async () => {
    setSubmitting(true)

    if (!stripe || !elements || !card || !cart) {
      setSubmitting(false)
      return
    }

    await stripe
      .confirmCardPayment(session?.data.client_secret as string, {
        payment_method: {
          card: card,
          billing_details: {
            name:
              cart.billing_address?.first_name +
              " " +
              cart.billing_address?.last_name,
            address: {
              city: cart.billing_address?.city ?? undefined,
              country: cart.billing_address?.country_code ?? undefined,
              line1: cart.billing_address?.address_1 ?? undefined,
              line2: cart.billing_address?.address_2 ?? undefined,
              postal_code: cart.billing_address?.postal_code ?? undefined,
              state: cart.billing_address?.province ?? undefined,
            },
            email: cart.email,
            phone: cart.billing_address?.phone ?? undefined,
          },
        },
      })
      .then(({ error, paymentIntent }) => {
        if (error) {
          const pi = error.payment_intent

          if (
            (pi && pi.status === "requires_capture") ||
            (pi && pi.status === "succeeded")
          ) {
            onPaymentCompleted()
          }

          setErrorMessage(error.message || null)
          return
        }

        if (
          (paymentIntent && paymentIntent.status === "requires_capture") ||
          paymentIntent.status === "succeeded"
        ) {
          return onPaymentCompleted()
        }

        return
      })
  }

  return (
    <>
      <Button
        disabled={disabled || notReady}
        onClick={handlePayment}
        size="large"
        isLoading={submitting}
        data-testid={dataTestId}
      >
        Place order
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="stripe-payment-error-message"
      />
    </>
  )
}

const ManualTestPaymentButton = ({ notReady }: { notReady: boolean }) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    try {
      await placeOrder()
    } catch (err: any) {
      // Don't show error if it's a redirect (order was successful)
      if (!isRedirectError(err)) {
        setErrorMessage(err.message)
        toast.error("Error al procesar el pedido. Inténtalo más tarde.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handlePayment = () => {
    setSubmitting(true)

    onPaymentCompleted()
  }

  return (
    <>
      <Button
        disabled={notReady}
        isLoading={submitting}
        onClick={handlePayment}
        size="large"
        data-testid="submit-order-button"
      >
        Place order
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="manual-payment-error-message"
      />
    </>
  )
}

export default PaymentButton
