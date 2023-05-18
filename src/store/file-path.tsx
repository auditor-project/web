import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type Nullable<T> = T | undefined;

interface IFilePathStore {
  path: Nullable<string>;
  setFilePath: (val: string | undefined) => void;
  clear: () => void;
}

export const useFilePathStore = create<IFilePathStore>()(
  devtools(
    persist(
      (set) => ({
        path: undefined,
        setFilePath: (val: string | undefined) => set(() => ({ path: val })),
        clear: () =>
          set(() => ({
            path: undefined,
          })),
      }),
      {
        name: "path-store",
      }
    )
  )
);
