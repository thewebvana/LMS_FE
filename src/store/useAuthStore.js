import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
	persist(
		(set) => ({
			user: null,
			token: null,
			isAuthenticated: false,

			// Set user data on login
			setUserData: (userData, token) => set({ user: userData, token, isAuthenticated: true }),

			// Logout function
			logoutUser: () => set({ user: null, token: null, isAuthenticated: false }),
		}),
		{ name: "auth-storage" } // Key for localStorage persistence
	)
);

export default useAuthStore;