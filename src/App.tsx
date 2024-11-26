import React from 'react'
import { CryptoPayment } from './components/CryptoPayment'

function App() {
  return (
    <CryptoPayment
      amount={99.99}
      productName="Premium Membership"
      description="Access to exclusive content and benefits"
      currency="USD"
      onPaymentComplete={(txHash) => console.log('Payment successful:', txHash)}
      onPaymentError={(error) => console.error('Payment error:', error)}
    />
  )
}

export default App
