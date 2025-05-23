import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-950 text-white py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="text-sm text-gray-400 mb-4 text-center">
          <h6 className="font-bold">Legal Disclaimer</h6>
          <p>
            None of the information on this website should be construed as
            providing legal or financial advice. Please note there are always
            risks associated with smart contracts. MemeX is not a registered
            broker, analyst, or investment advisor. If you have purchased
            $MemeX, you agree that you are not purchasing a security or
            investment. You also agree that the team is representing
            the token as community members and cannot modify the contract due to
            it being renounced. Do conduct your own due diligence and consult
            your financial advisor before making any investment decision.
          </p>
        </div>
        <div className="text-center mb-4">
          <h6>Follow us on social media</h6>
          <a href="https://x.com/memexairdrop" className="mr-2">
            🐦
          </a>
          <a href="https://t.me/MemeXGloball">
            ✈️
          </a>
        </div>
        <div className="text-center text-gray-400">
          &copy; {new Date().getFullYear()} MemeX. All rights reserved.
        </div>
        <div className="text-center text-gray-400 mt-2">
          🚀 Powered by Electra Protocol, ensuring the lowest fees, fastest
          transactions, and ultimate security!
        </div>
        <div className="text-center text-gray-400 mt-2">
          This site belongs to the MemeX Community. The fee for each NFT sold
          will be burned. NFTs sold via XEP will buy MEMEX from the market and
          burn it, while those sold directly with MEMEX will be burned directly.
        </div>
      </div>
    </footer>
  );
};
