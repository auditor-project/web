import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type Nullable<T> = T | undefined;

interface ITeamStore {
  teamId: Nullable<string>;
  setTeamId: (team: string | undefined) => void;
  clear: () => void;
}

export const useTeamStore = create<ITeamStore>()(
  devtools(
    persist(
      (set) => ({
        teamId: undefined,
        setTeamId: (team: string | undefined) => set(() => ({ teamId: team })),
        clear: () =>
          set(() => ({
            teamId: undefined,
          })),
      }),
      {
        name: "team-store",
      }
    )
  )
);
