// store/useTabStore.ts
import { create } from "zustand";

interface TabState {
  tab: string;
  setTab: (value: string) => void;
}

export const useTabStore = create<TabState>((set) => ({
  tab: "all", // default tab
  setTab: (value) => set({ tab: value }),
}));
