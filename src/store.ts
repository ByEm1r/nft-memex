import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from './supabaseClient';
import { NFT, Order } from './types';

interface StoreState {
  nfts: NFT[];
  orders: Order[];
  pendingBurn: number;
  burnedAmount: number;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addNFT: (nft: Omit<NFT, 'id' | 'soldCount'>) => Promise<void>;
  updateNFT: (id: string, updates: Partial<NFT>) => Promise<void>;
  deleteNFT: (id: string) => Promise<void>;
  addOrder: (order: Omit<Order, 'id'>) => Promise<void>;
  updateOrder: (id: string, updates: Partial<Order>) => Promise<void>;
  updatePendingBurn: (amount: number) => Promise<void>;
  updateBurnedAmount: (amount: number) => Promise<void>;
  loadInitialData: () => Promise<void>;
  formatPrice: (price: number) => string;
}

export const useStore = create<StoreState>((set, get) => ({
  nfts: [],
  orders: [],
  pendingBurn: 0,
  burnedAmount: 0,
  isAuthenticated: false,

  login: (username, password) => {
    if (username === 'PlanC' && password === 'Ceyhun8387@') {
      set({ isAuthenticated: true });
      return true;
    }
    return false;
  },

  logout: () => set({ isAuthenticated: false }),

  addNFT: async (nft) => {
    try {
      const newNFT: NFT = { id: uuidv4(), soldCount: 0, ...nft };
      const { error } = await supabase.from('nfts').insert([newNFT]);
      if (error) throw error;
      set((state) => ({ nfts: [...state.nfts, newNFT] }));
    } catch (error) {
      console.error('Error adding NFT:', error);
      throw error;
    }
  },

  updateNFT: async (id, updates) => {
    try {
      const { error } = await supabase.from('nfts').update(updates).eq('id', id);
      if (error) throw error;
      set((state) => ({
        nfts: state.nfts.map((nft) => (nft.id === id ? { ...nft, ...updates } : nft)),
      }));
    } catch (error) {
      console.error('Error updating NFT:', error);
      throw error;
    }
  },

  deleteNFT: async (id) => {
    try {
      const { error } = await supabase.from('nfts').delete().eq('id', id);
      if (error) throw error;
      set((state) => ({ nfts: state.nfts.filter((nft) => nft.id !== id) }));
    } catch (error) {
      console.error('Error deleting NFT:', error);
      throw error;
    }
  },

  addOrder: async (orderData) => {
    try {
      const { data: nft, error: nftError } = await supabase
          .from('nfts')
          .select('soldCount, mintCount')
          .eq('id', orderData.nftId)
          .single();

      if (nftError) throw nftError;
      if (!nft) throw new Error('NFT not found');
      if (nft.soldCount >= nft.mintCount) throw new Error('NFT is sold out');

      const order = {
        id: uuidv4(),
        ...orderData,
        created_at: new Date().toISOString(),
        status: 'pending'
      };

      const { error: orderError } = await supabase.from('orders').insert([order]);
      if (orderError) throw orderError;

      const { error: updateError } = await supabase
          .from('nfts')
          .update({ soldCount: nft.soldCount + 1 })
          .eq('id', orderData.nftId);

      if (updateError) throw updateError;

      set((state) => ({
        orders: [...state.orders, order],
        nfts: state.nfts.map((n) =>
            n.id === orderData.nftId ? { ...n, soldCount: n.soldCount + 1 } : n
        ),
      }));
    } catch (error) {
      console.error('Error adding order:', error);
      throw error;
    }
  },

  updateOrder: async (id, updates) => {
    try {
      const { error } = await supabase.from('orders').update(updates).eq('id', id);
      if (error) throw error;
      set((state) => ({
        orders: state.orders.map((order) => (order.id === id ? { ...order, ...updates } : order)),
      }));
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  },

  updatePendingBurn: async (amount) => {
    const newAmount = get().pendingBurn + amount;
    set({ pendingBurn: newAmount });
    await supabase.from('settings').update({ value: newAmount }).eq('key', 'pendingBurn');
  },

  updateBurnedAmount: async (amount) => {
    set({ burnedAmount: amount });
    await supabase.from('settings').update({ value: amount }).eq('key', 'burnedTotal');
  },

  loadInitialData: async () => {
    try {
      const [nftResponse, orderResponse, settingsResponse] = await Promise.all([
        supabase.from('nfts').select('*').order('id', { ascending: true }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('settings').select('*')
      ]);

      if (nftResponse.error) throw nftResponse.error;
      if (orderResponse.error) throw orderResponse.error;
      if (settingsResponse.error) throw settingsResponse.error;

      const settings = settingsResponse.data || [];
      const pending = settings.find((s) => s.key === 'pendingBurn');
      const burned = settings.find((s) => s.key === 'burnedTotal');

      set({
        nfts: nftResponse.data || [],
        orders: orderResponse.data || [],
        pendingBurn: Number(pending?.value) || 0,
        burnedAmount: Number(burned?.value) || 0,
      });
    } catch (error) {
      console.error('Error loading data:', error);
      throw error;
    }
  },

  formatPrice: (price: number) => {
    if (typeof price !== 'number') return '0.00';
    return price.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  },
}));
