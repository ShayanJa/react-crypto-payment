## React Crypto Payment Component

A beautiful, production-ready React component for accepting cryptocurrency payments.

### Installation

```bash
npm install @shayanja/react-crypto-payment
```

### Usage

```tsx
import { CryptoPayment } from '@shayanja/react-crypto-payment';

function App() {
  return (
    <CryptoPayment
      amount={99.99}
      currency="USD"
      onSuccess={(txHash) => console.log('Payment successful:', txHash)}
      onError={(error) => console.error('Payment error:', error)}
      theme="light"
    />
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| amount | number | required | The payment amount |
| currency | 'USD' \| 'EUR' \| 'GBP' | 'USD' | The currency for the payment |
| onSuccess | (txHash: string) => void | undefined | Callback when payment is successful |
| onError | (error: Error) => void | undefined | Callback when an error occurs |
| theme | 'light' \| 'dark' | 'light' | The theme of the component |

### Features

- 🎨 Beautiful, production-ready UI
- 📱 Responsive design
- 🌗 Light/dark theme support
- 💱 Multiple cryptocurrency support
- 📷 QR code generation
- 📋 Copy-to-clipboard functionality
- 🔗 Blockchain explorer integration
- 📦 TypeScript support

### License

MIT