import React from 'react';
import { Link } from 'react-router-dom';
import { NFT } from '../types';
import { useStore } from '../store';

interface NFTCardProps {
    nft: NFT;
}

export const NFTCard: React.FC<NFTCardProps> = ({ nft }) => {
    const isSoldOut = nft.soldCount >= nft.mintCount;
    const { formatPrice } = useStore();

    const handleClick = () => {
        window.scrollTo(0, 0);
    };

    return (
        <div className="bg-gray-900 rounded-xl shadow-md overflow-hidden relative transform transition-transform hover:scale-105 hover:shadow-lg flex flex-col">
            <Link to={`/purchase/${nft.id}`} className="block" onClick={handleClick}>
                <div className="relative">
                    <img
                        src={nft.image}
                        alt={nft.title}
                        className="w-full h-64 object-cover rounded-t-xl"
                        style={{ objectFit: 'cover' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-950 opacity-60"></div>
                </div>
            </Link>

            <div className="p-6 flex-grow">
                <h3 className="text-xl font-bold text-white mb-2">{nft.title}</h3>
                <p className="text-gray-400 mb-4 h-24 overflow-hidden">{nft.description}</p>

                <hr className="border-gray-700 my-4 shadow-lg" />

                <div className="mb-2 text-center">
                    <p className="text-emerald-400 text-lg font-semibold">{formatPrice(nft.price)} MemeX</p>
                    <p className="text-white font-bold">OR</p>
                    <p className="text-blue-400 text-lg font-semibold">{formatPrice(nft.priceXEP)} XEP</p>
                </div>
                <hr className="border-gray-700 my-4 shadow-lg" />
                <p className="text-gray-400 text-center">
                    {Number(nft.soldCount)}/{Number(nft.mintCount)} Minted
                </p>
                {isSoldOut && (
                    <div className="absolute top-0 left-0 w-full h-full bg-gray-900 bg-opacity-75 flex items-center justify-center">
                        <span className="text-2xl font-bold text-red-500">Sold Out</span>
                    </div>
                )}
            </div>

            <div className="p-4">
                <Link to={`/purchase/${nft.id}`} onClick={handleClick}>
                    <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg font-bold transition-colors flex items-center justify-center">
                        Buy NFT
                    </button>
                </Link>
            </div>
        </div>
    );
};
