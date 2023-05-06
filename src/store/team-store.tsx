import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type Nullable<T> = T | undefined;

interface ITeamStore {
  teamId: string;
  setTeamId: (team: string) => void;
  clear: () => void;
}

export const useTeamStore = create<ITeamStore>()(
  devtools(
    persist(
      (set) => ({
        teamId: "",
        setTeamId: (team: string | undefined) => set(() => ({ teamId: team })),
        clear: () =>
          set(() => ({
            teamId: "'",
          })),
      }),
      {
        name: "team-store",
      }
    )
  )
);
