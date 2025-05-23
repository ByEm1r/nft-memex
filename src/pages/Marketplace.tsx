import React from 'react';
import { useStore } from '../store';
import { NFTCard } from '../components/NFTCard';

export const Marketplace: React.FC = () => {
  const { nfts } = useStore();

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-white mb-12 text-center">
          NFT Marketplace
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {nfts.map((nft) => (
            <NFTCard key={nft.id} nft={nft} />
          ))}
        </div>
      </div>
    </div>
  );
};
