import { create } from "zustand";
// Define the Type for Zustand Store
interface AuthState {
  isAuth: boolean;
  authenticate: () => void;
  logout: () => void;
}

// Create a Zustand store with typed state
const useAuthSession = create<AuthState>((set) => ({
  isAuth: false,  
  authenticate: () => set({ isAuth: true }),
  logout: () => set({ isAuth: false }),
}));



export { useAuthSession };
