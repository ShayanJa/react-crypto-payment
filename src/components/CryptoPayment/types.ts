export type SupportedCrypto = 'ETH' | 'BTC' | 'USDC'

export interface PaymentDetails {
  amount: number
  currency: SupportedCrypto
  description?: string
}

export interface CryptoPaymentProps {
  amount: number
  currency?: string
  onPaymentComplete?: (txHash: string) => void
  onPaymentError?: (error: Error) => void
  onPaymentPending?: (id: string) => string
  apiUrl?: string
  supportedCurrencies?: SupportedCrypto[]
  description?: string
  productName?: string
}
