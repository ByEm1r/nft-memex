import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '../store';
import { QRCodeSVG } from 'qrcode.react';
import { NFT } from '../types';

export const Purchase: React.FC = () => {
  const { id } = useParams();
  const { nfts, addOrder, formatPrice } = useStore();
  const [walletAddress, setWalletAddress] = useState('');
  const [txHash, setTxHash] = useState('');
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [walletAddressError, setWalletAddressError] = useState('');
  const [txHashError, setTxHashError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nft = nfts.find((n) => n.id === id);

  if (!nft) {
    return <div>NFT not found</div>;
  }

  if (nft.soldCount >= nft.mintCount) {
    return <div>This NFT is sold out.</div>;
  }

  const paymentAddress = 'xTSNVy4GLEDETscV2HFQ8HoThzpWWmxArP';

  const sendTelegramNotification = async (nft: NFT, walletAddress: string, txHash: string) => {
    try {
      const chatIds = ['-1002504090329', '-1002434790072', '-1002370646546'];

      await Promise.all(chatIds.map(chatId =>
          fetch(`https://api.telegram.org/bot${import.meta.env.VITE_TELEGRAM_BOT_TOKEN}/sendPhoto`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              chat_id: chatId,
              photo: nft.image || 'https://placehold.co/600x400?text=NFT+Image',
              caption: `🔥 *New NFT Order Alert!* 🔥\n\n🎨 *NFT Title:* ${nft.title}\n💰 *Price:* ${formatPrice(nft.price)} MemeX\n💳 *Wallet:* \`${walletAddress}\`\n🔗 *Tx Hash:* \`${txHash}\`\n\n🌐 [View on Marketplace](https://nft.memextoken.org/)`,
              parse_mode: 'Markdown',
            }),
          })
      ));
    } catch (error) {
      console.error('Failed to send Telegram notification:', error);
      // Don't throw here - we don't want to fail the order if notifications fail
    }
  };

  const handleConfirmPayment = async () => {
    // Reset errors
    setWalletAddressError('');
    setTxHashError('');
    setError(null);

    // Validate inputs
    if (!walletAddress) {
      setWalletAddressError('Wallet address is required.');
      return;
    }

    if (!walletAddress.startsWith('x')) {
      setWalletAddressError('Wallet address must start with "x".');
      return;
    }

    if (!txHash) {
      setTxHashError('Transaction hash is required.');
      return;
    }

    setIsProcessing(true);

    try {
      const order = {
        nftTitle: nft.title,
        customer: 'Customer Name',
        walletAddress: walletAddress,
        purchaseDate: new Date().toISOString(),
        status: 'pending',
        nftId: nft.id,
        txHash: txHash,
      };

      await addOrder(order);
      await sendTelegramNotification(nft, walletAddress, txHash);
      setPaymentConfirmed(true);
      alert('Payment confirmed and order saved!');
    } catch (error) {
      console.error('Error processing order:', error);
      setError(error instanceof Error ? error.message : 'There was an error processing your order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
      <div className="min-h-screen bg-gray-900 py-12">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="bg-gray-800 rounded-xl p-8">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <img src={nft.image} alt={nft.title} className="w-full rounded-xl" />
                <h2 className="text-3xl font-bold text-white mt-6 mb-4">{nft.title}</h2>
                <p className="text-gray-400 mb-4">{nft.description}</p>
                <div className="mb-6 text-center">
                  <p className="text-emerald-400 text-lg font-semibold">{formatPrice(nft.price)} MemeX</p>
                  <p className="text-white font-bold">OR</p>
                  <p className="text-blue-400 text-lg font-semibold">{formatPrice(nft.priceXEP)} XEP</p>
                </div>
                <p className="text-gray-400 text-center">
                  {Number(nft.soldCount)}/{Number(nft.mintCount)} Minted
                </p>
              </div>

              <div className="bg-gray-700 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-6">Complete Your Purchase</h3>

                {error && (
                    <div className="mb-6 p-4 bg-red-900/50 rounded-lg">
                      <p className="text-red-200">{error}</p>
                    </div>
                )}

                <div className="mb-6">
                  <label className="block text-gray-400 mb-2">Your NFT Wallet Address</label>
                  <input
                      type="text"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      placeholder="Enter your wallet address"
                      className="w-full bg-gray-800 text-white p-3 rounded-lg"
                      required
                      disabled={isProcessing || paymentConfirmed}
                  />
                  {walletAddressError && <p className="text-red-500 text-sm mt-1">{walletAddressError}</p>}
                  <p className="text-sm text-gray-400 mt-2">The NFT will be transferred to this address after payment</p>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-400 mb-2">Transaction Hash</label>
                  <input
                      type="text"
                      value={txHash}
                      onChange={(e) => setTxHash(e.target.value)}
                      placeholder="Enter your transaction hash"
                      className="w-full bg-gray-800 text-white p-3 rounded-lg"
                      required
                      disabled={isProcessing || paymentConfirmed}
                  />
                  {txHashError && <p className="text-red-500 text-sm mt-1">{txHashError}</p>}
                  <p className="text-sm text-gray-400 mt-2">Enter the transaction hash of your payment</p>
                </div>

                <div className="text-center mb-6">
                  <QRCodeSVG value={paymentAddress} size={200} className="mx-auto bg-white p-2 rounded-lg" />
                  <p className="text-sm text-gray-400 mt-2">Scan to get payment address</p>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg mb-6">
                  <p className="text-sm text-gray-400 mb-2">Payment Address:</p>
                  <p className="text-white break-all font-mono">{paymentAddress}</p>
                </div>

                <div className="bg-blue-900/50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-blue-200">
                    Important: Send exactly {formatPrice(nft.price)} MemeX OR {formatPrice(nft.priceXEP)} XEP to the payment
                    address. Your NFT will be transferred to your wallet address after payment confirmation.
                  </p>
                </div>

                <button
                    onClick={handleConfirmPayment}
                    className={`w-full ${
                        isProcessing || paymentConfirmed
                            ? 'bg-gray-500 cursor-not-allowed'
                            : 'bg-emerald-500 hover:bg-emerald-600'
                    } text-white font-bold py-3 px-6 rounded-lg transition-colors`}
                    disabled={isProcessing || paymentConfirmed}
                >
                  {isProcessing
                      ? 'Processing...'
                      : paymentConfirmed
                          ? 'Payment Confirmed'
                          : 'Confirm Payment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};