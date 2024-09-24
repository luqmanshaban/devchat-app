import { create } from "zustand";
import { User } from "../lib/types";

export const loggedInUserDetails = create<{
    user: User | null;
    status: string;
    setUser: (newUser: User) => void;
    updateStatus: (status: string) => void;
    clearUser: () => void;
}>(set => {
    const storedUser = localStorage.getItem('user');
    const initialUser = storedUser ? JSON.parse(storedUser) : null;
    const storedStatus = localStorage.getItem('status')
    const initialStatus = storedStatus ? storedStatus.toString() : '';

    return {
        user: initialUser,
        status: initialStatus,

        setUser: (newUser: User) => {
            set({ user: newUser });
            localStorage.setItem('user', JSON.stringify(newUser));
        },
        updateStatus: (status: string) => {
            localStorage.setItem('status', status)
        },
        clearUser: () => {
            set({ user: null });
            localStorage.removeItem('user');
        }
    };
});
