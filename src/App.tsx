import React from 'react'
import { CryptoPayment } from './components/CryptoPayment'

function App() {
  return (
    <CryptoPayment
      amount={0.1}
      productName="Premium Membership"
      description="Access to exclusive content and benefits"
      currency="USD"
      onPaymentComplete={(txHash) => console.log('Payment successful:', txHash)}
      onPaymentError={(error) => console.error('Payment error:', error)}
      apiUrl="http://localhost:3000/api"
    />
  )
}

export default App
