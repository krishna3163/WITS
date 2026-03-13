import { create } from 'zustand';
import { insforge } from '../lib/insforge';

interface User {
    id: string;
    email: string;
    profile?: any;
}

interface AuthState {
    user: User | null;
    session: any | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    checkSession: () => Promise<void>;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    session: null,
    isAuthenticated: false,
    isLoading: true,

    checkSession: async () => {
        try {
            const { data, error } = await insforge.auth.getCurrentSession();

            if (error) {
                console.debug("Session check:", error.message);
                set({ user: null, session: null, isAuthenticated: false, isLoading: false });
                return;
            }

            if (data?.session) {
                set({
                    user: data.session.user as User,
                    session: data.session,
                    isAuthenticated: true,
                    isLoading: false
                });
            } else {
                set({ user: null, session: null, isAuthenticated: false, isLoading: false });
            }
        } catch (err) {
            console.error("Auth check failed:", err);
            set({ user: null, session: null, isAuthenticated: false, isLoading: false });
        }
    },

    logout: async () => {
        await insforge.auth.signOut();
        set({ user: null, session: null, isAuthenticated: false });
    }
}));
