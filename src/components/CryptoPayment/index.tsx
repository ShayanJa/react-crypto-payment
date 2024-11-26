import React, { useState, useEffect } from 'react'
import QRCode from 'react-qr-code'
import { Copy, Check } from 'lucide-react'
import { CryptoPaymentProps, SupportedCrypto } from './types'
import { generatePaymentAddress, formatCryptoAmount } from './utils'
import { CheckoutButton } from './CheckoutButton'
import { Modal } from './Modal'
import { PaymentStatus } from './PaymentStatus'
import { CountdownTimer } from './CountdownTimer'
import { usePaymentMonitor } from './hooks/usePaymentMonitor'
import { createCheckout, createPayment } from '../../lib/api'
import { getPriceFromCoingecko } from '../CryptoPayment/utils'

const PAYMENT_WINDOW_MINUTES = 30

export const CryptoPayment: React.FC<CryptoPaymentProps> = ({
  amount,
  currency = 'USD',
  onPaymentComplete,
  onPaymentError,
  onPaymentPending,
  supportedCurrencies = ['ETH', 'BTC', 'USDC'],
  description,
  apiUrl,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCurrency, setSelectedCurrency] =
    useState<SupportedCrypto | null>(null)
  const [paymentAddress, setPaymentAddress] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [expiryTime, setExpiryTime] = useState<Date | null>(null)
  const [sessionId, setSessionId] = useState<number | null>(null)
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null)
  const [paymentCreated, setPaymentCreated] = useState(false)

  const { status, error } = usePaymentMonitor(
    paymentAddress,
    selectedCurrency,
    estimatedCost || 0,
    apiUrl
  )

  useEffect(() => {
    const getPrices = async () => {
      if (selectedCurrency) {
        console.log(selectedCurrency)
        if (selectedCurrency === 'USDC') {
          setEstimatedCost(amount)
        } else {
          const price = await getPriceFromCoingecko(selectedCurrency)
          if (price) {
            setEstimatedCost(amount / price)
          }
        }
      }
    }
    getPrices()
  }, [selectedCurrency, amount])

  useEffect(() => {
    if (status.isReceived && status.txHash) {
      onPaymentComplete?.(status.txHash)
      setTimeout(() => {
        setIsModalOpen(false)
        resetPaymentState()
      }, 2000)
    }
  }, [status.isReceived, status.txHash])

  useEffect(() => {
    if (error) {
      onPaymentError?.(error)
    }
  }, [error])

  useEffect(() => {
    if (isModalOpen && selectedCurrency && !paymentCreated) {
      const setupPayment = async () => {
        setIsLoading(true)
        try {
          const price = await getPriceFromCoingecko(selectedCurrency)
          if (price) {
            const cryptoAmount = amount / price
            setEstimatedCost(cryptoAmount)
            const res = await createPayment({
              amount: cryptoAmount,
              currency: selectedCurrency,
            })
            setPaymentAddress(res.address)
            setExpiryTime(
              new Date(Date.now() + PAYMENT_WINDOW_MINUTES * 60 * 1000)
            )
            setPaymentCreated(true)
            onPaymentPending?.(res.id)
          }
        } catch (error) {
          onPaymentError?.(error as Error)
        } finally {
          setIsLoading(false)
        }
      }
      setupPayment()
    }
  }, [selectedCurrency, isModalOpen, paymentCreated])

  const resetPaymentState = () => {
    setSelectedCurrency(null)
    setPaymentAddress('')
    setExpiryTime(null)
    setEstimatedCost(null)
    setPaymentCreated(false)
    setSessionId(null)
  }

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(paymentAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCurrencySelect = (crypto: SupportedCrypto) => {
    setSelectedCurrency(crypto)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    if (!status.isReceived) {
      setIsModalOpen(false)
      resetPaymentState()
    }
  }

  const handleExpire = () => {
    if (!status.isReceived) {
      setIsModalOpen(false)
      resetPaymentState()
      onPaymentError?.(new Error('Payment window expired'))
    }
  }

  const PaymentModal = () => (
    <div className="p-6">
      <div className="mb-6 animate-fadeIn">
        <h2 className="text-2xl font-bold text-gray-800">
          {selectedCurrency} Payment
        </h2>
      </div>

      {description && (
        <p className="text-gray-600 mb-4 animate-fadeIn delay-100">
          {description}
        </p>
      )}

      <div className="bg-gray-50 p-4 rounded-lg mb-6 animate-fadeIn delay-200">
        <div className="text-center mb-2">
          <span className="text-sm text-gray-600">Amount to Pay</span>
          <div className="text-2xl font-bold text-gray-900">
            {selectedCurrency &&
              estimatedCost &&
              formatCryptoAmount(estimatedCost, selectedCurrency)}
          </div>
          <div className="text-sm text-gray-500">
            ≈ {amount} {currency}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-[200px] animate-pulse">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="flex justify-center mb-6 animate-fadeIn delay-300">
            <div className="p-3 bg-white rounded-lg transform transition-transform duration-300 hover:scale-105">
              <QRCode
                value={paymentAddress}
                size={200}
                level="H"
                className="mx-auto"
              />
            </div>
          </div>

          {expiryTime && (
            <div className="mb-4 animate-fadeIn delay-300">
              <CountdownTimer expiryTime={expiryTime} onExpire={handleExpire} />
            </div>
          )}

          <div className="mb-6">
            <PaymentStatus
              isReceived={status.isReceived}
              confirmations={status.confirmations}
              error={error}
            />
          </div>

          <div className="relative animate-fadeIn delay-400">
            <input
              type="text"
              value={paymentAddress}
              readOnly
              className="w-full px-4 py-3 bg-gray-50 rounded-lg pr-12 font-mono text-sm transition-all duration-200 hover:bg-gray-100"
            />
            <button
              onClick={handleCopyAddress}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <Copy className="w-5 h-5 text-gray-500" />
              )}
            </button>
          </div>
        </>
      )}
    </div>
  )

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto space-y-8">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Premium Plan</h2>
            <p className="text-gray-600 mb-6">
              Get access to all premium features
            </p>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">$99.99</span>
              <CheckoutButton
                amount={amount}
                currency={currency}
                onCurrencySelect={handleCurrencySelect}
                supportedCurrencies={supportedCurrencies}
              />
              <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <PaymentModal />
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
