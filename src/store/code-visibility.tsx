import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface IVisibilityStore {
  count: number;
  setVisibility: (val: number) => void;
  clear: () => void;
}

export const useVisibilityStore = create<IVisibilityStore>()(
  devtools(
    persist(
      (set) => ({
        count: 7,
        setVisibility: (val: number) => set(() => ({ count: val })),
        clear: () =>
          set(() => ({
            count: 7,
          })),
      }),
      {
        name: "code-visibility-store",
      }
    )
  )
);
