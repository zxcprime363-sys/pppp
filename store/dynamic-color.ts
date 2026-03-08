// store/primary-color.ts
import { create } from "zustand";

type PrimaryColorStore = {
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
};

export const usePrimaryColorStore = create<PrimaryColorStore>((set) => ({
  primaryColor: "16, 29, 43",
  setPrimaryColor: (color) => set({ primaryColor: color }),
}));
// primaryColor: "31, 57, 55",
