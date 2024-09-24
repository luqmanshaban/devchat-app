import { create } from "zustand";


const useStore = create(set => ({
    bears: 0,
    increase: () => set((state: any) => ({ bears: state.bears + 1 })),
    decrease: () => set((state: any) => ({ bears: state.bears - 1 })),
    clear: () => set({ bears: 0 }),
}))

export default useStore