import { create } from 'zustand';
import { insforge } from '../lib/insforge';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
    session: any | null;
    loading: boolean;
    error: string | null;
    checkSession: () => Promise<void>;
    signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    session: null,
    loading: true,
    error: null,
    checkSession: async () => {
        try {
            set({ loading: true });
            const session = await insforge.auth.getCurrentSession();
            set({ session, loading: false });
        } catch (err: any) {
            set({ error: err.message, loading: false });
        }
    },
    signOut: async () => {
        await insforge.auth.signOut();
        set({ session: null });
    }
}));
