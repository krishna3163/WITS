import { create } from 'zustand';
import { insforge } from '../lib/insforge';

interface User {
    id: string;
    email: string;
    profile?: any;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    checkSession: () => Promise<void>;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,

    checkSession: async () => {
        set({ isLoading: true });
        try {
            const { data, error } = await insforge.auth.getCurrentSession();
            if (data?.session?.user && !error) {
                set({
                    user: data.session.user as User,
                    isAuthenticated: true,
                    isLoading: false
                });
            } else {
                set({ user: null, isAuthenticated: false, isLoading: false });
            }
        } catch (err) {
            set({ user: null, isAuthenticated: false, isLoading: false });
        }
    },

    logout: async () => {
        await insforge.auth.signOut();
        set({ user: null, isAuthenticated: false });
    }
}));
