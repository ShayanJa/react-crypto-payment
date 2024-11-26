import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Bitcoin, Copy, Check, ExternalLink } from 'lucide-react';

export interface CryptoPaymentProps {
  amount: number;
  currency?: 'USD' | 'EUR' | 'GBP';
  onSuccess?: (txHash: string) => void;
  onError?: (error: Error) => void;
  theme?: 'light' | 'dark';
}

interface CryptoOption {
  name: string;
  symbol: string;
  address: string;
  icon: React.ReactNode;
}

const cryptoOptions: CryptoOption[] = [
  {
    name: 'Bitcoin',
    symbol: 'BTC',
    address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', // Example address
    icon: <Bitcoin className="w-6 h-6" />,
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e', // Example address
    icon: <Bitcoin className="w-6 h-6" />,
  },
];

export const CryptoPayment: React.FC<CryptoPaymentProps> = ({
  amount,
  currency = 'USD',
  onSuccess,
  onError,
  theme = 'light',
}) => {
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoOption>(cryptoOptions[0]);
  const [copied, setCopied] = useState(false);
  const [estimatedCrypto, setEstimatedCrypto] = useState<number>(0);

  useEffect(() => {
    // Simulate fetching current crypto prices
    // In production, you'd want to use a real price feed
    const fetchEstimatedAmount = async () => {
      try {
        // Simulated exchange rates
        const rates = {
          BTC: 50000,
          ETH: 3000,
        };
        setEstimatedCrypto(amount / rates[selectedCrypto.symbol as keyof typeof rates]);
      } catch (error) {
        onError?.(error as Error);
      }
    };

    fetchEstimatedAmount();
  }, [amount, selectedCrypto, onError]);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(selectedCrypto.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      onError?.(error as Error);
    }
  };

  const bgColor = theme === 'light' ? 'bg-white' : 'bg-gray-900';
  const textColor = theme === 'light' ? 'text-gray-900' : 'text-white';
  const borderColor = theme === 'light' ? 'border-gray-200' : 'border-gray-700';

  return (
    <div className={`${bgColor} ${textColor} rounded-xl shadow-lg p-6 max-w-md w-full mx-auto`}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Crypto Payment</h2>
          <span className="text-lg font-bold">
            {amount} {currency}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {cryptoOptions.map((crypto) => (
            <button
              key={crypto.symbol}
              onClick={() => setSelectedCrypto(crypto)}
              className={`flex items-center justify-center space-x-2 p-3 rounded-lg border transition-all
                ${selectedCrypto.symbol === crypto.symbol
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : `${borderColor} hover:border-blue-300`}`}
            >
              {crypto.icon}
              <span>{crypto.symbol}</span>
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex justify-center">
            <QRCodeSVG
              value={selectedCrypto.address}
              size={200}
              level="H"
              className="p-2 bg-white rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm text-center text-gray-500 dark:text-gray-400">
              Send approximately
            </p>
            <p className="text-center font-mono font-bold">
              {estimatedCrypto.toFixed(8)} {selectedCrypto.symbol}
            </p>
          </div>

          <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <input
              type="text"
              value={selectedCrypto.address}
              readOnly
              className="flex-1 bg-transparent font-mono text-sm outline-none"
            />
            <button
              onClick={handleCopyAddress}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
            </button>
            <a
              href={`https://etherscan.io/address/${selectedCrypto.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="text-sm text-center text-gray-500 dark:text-gray-400">
          Payment will be confirmed automatically after the transaction is verified
        </div>
      </div>
    </div>
  );
};

export default CryptoPayment;