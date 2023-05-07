import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { teamRouter } from "./routers/team-router";
import { projectRouter } from "./routers/projects";
import { resultsRouter } from "./routers/results";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  teams: teamRouter,
  projects: projectRouter,
  results: resultsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
