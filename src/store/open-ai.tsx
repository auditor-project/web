import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type Nullable<T> = T | undefined;

interface IOpenAiKeyStore {
  key: Nullable<string>;
  setKey: (val: string | undefined) => void;
  clear: () => void;
}

export const useOpenAiKeyStore = create<IOpenAiKeyStore>()(
  devtools(
    persist(
      (set) => ({
        key: undefined,
        setKey: (val: string | undefined) => set(() => ({ key: val })),
        clear: () =>
          set(() => ({
            key: undefined,
          })),
      }),
      {
        name: "openai-key-store",
      }
    )
  )
);
