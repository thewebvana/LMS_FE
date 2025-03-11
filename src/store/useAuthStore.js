import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null, 

  // Set user data
  setUser: (data) => {
    set({ user: data });
  },

}));

export default useAuthStore;