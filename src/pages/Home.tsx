import React from 'react';
import { NFTCard } from '../components/NFTCard';
import { useStore } from '../store';
import { Lightbulb, Gem, Code } from 'lucide-react';

export const Home: React.FC = () => {
  const { nfts } = useStore();

  return (
      <div className="min-h-screen bg-gray-900 py-12">
        <div className="container mx-auto p-6 rounded-lg shadow-xl bg-gray-800">
          <section className="mb-12 relative">
            <div
                className="relative overflow-hidden"
                style={{ height: '312.5px', marginBottom: '2rem' }}
            >
              <img
                  src="https://cdn.glitch.global/98864b85-1f3e-4005-b562-c76cd00dd9d3/nft.jpg"
                  alt="NFT Concept"
                  className="w-full h-full object-cover absolute transition-transform duration-500 hover:scale-110"
                  style={{
                    objectFit: 'cover',
                    height: '625px',
                    marginTop: '-156.25px',
                    marginBottom: '-156.25px',
                  }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
              <div className="absolute bottom-0 right-0 p-4 text-right text-white">
                <p className="text-sm italic">MemeX NFT</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-white text-center">
                <Lightbulb className="mx-auto h-12 w-12 mb-4 text-emerald-500" />
                <h3 className="text-xl font-semibold mb-2">Digital Ownership</h3>
                <p className="text-gray-400">
                  NFTs represent unique digital assets, proving ownership of items
                  like art, music, and more.
                </p>
              </div>

              <div className="text-white text-center">
                <Gem className="mx-auto h-12 w-12 mb-4 text-emerald-500" />
                <h3 className="text-xl font-semibold mb-2">Unique & Collectible</h3>
                <p className="text-gray-400">
                  Each NFT is one-of-a-kind, making them valuable collectibles in the
                  digital world.
                </p>
              </div>

              <div className="text-white text-center">
                <Code className="mx-auto h-12 w-12 mb-4 text-emerald-500" />
                <h3 className="text-xl font-semibold mb-2">Blockchain Secured</h3>
                <p className="text-gray-400">
                  NFTs are secured using blockchain technology, ensuring authenticity
                  and preventing fraud.
                </p>
              </div>
            </div>
          </section>

          <h2 className="text-3xl font-bold text-white mb-8">Marketplace</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {nfts.map((nft) => (
                <NFTCard key={nft.id} nft={nft} />
            ))}
          </div>
        </div>
      </div>
  );
};
