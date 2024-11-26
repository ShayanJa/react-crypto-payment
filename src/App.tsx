import React from 'react';
import { CryptoPayment } from './components/CryptoPayment';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto">
        <CryptoPayment
          amount={99.99}
          currency="USD"
          onSuccess={(txHash) => console.log('Payment successful:', txHash)}
          onError={(error) => console.error('Payment error:', error)}
        />
      </div>
    </div>
  );
}

export default App;