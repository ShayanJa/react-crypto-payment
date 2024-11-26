const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

interface CreatePaymentData {
  amount: number
  currency: 'ETH' | 'BTC' | 'USDC'
  webhookUrl?: string
  expiresIn?: number
}

interface PaymentResponse {
  id: string
  address: string
  currency: 'ETH' | 'BTC' | 'USDC'
  amount: number
  expiresAt: string
}

interface PaymentStatusResponse {
  isReceived: boolean
  status?: 'pending' | 'completed' | 'expired'
  txHash?: string
  confirmations?: number
}

export const createPayment = async (
  data: CreatePaymentData,
  apiUrl: string | null = API_BASE_URL
): Promise<PaymentResponse> => {
  const response = await fetch(`${apiUrl}/payment/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Failed to create payment')
  }

  return response.json()
}

export const checkPaymentStatus = async (
  address: string,
  currency: 'ETH' | 'BTC' | 'USDC',
  expectedAmount: number,
  apiUrl: string | null = API_BASE_URL
): Promise<PaymentStatusResponse> => {
  const response = await fetch(`${apiUrl}/payment/check`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      address,
      currency,
      expectedAmount,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to check payment status')
  }

  return response.json()
}
