/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const projectRouter = createTRPCRouter({
  projects: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.project.findMany({
        where: {
          teamId: input.teamId,
        },
      });
    }),

  findById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const project = await ctx.prisma.project.findFirst({
        where: {
          id: input.id,
        },
      });

      return project;
    }),

  exists: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.project.count({
        where: {
          id: input.id,
        },
      });
    }),

  upsert: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
        name: z.string(),
        description: z.string(),
        currentStatus: z.string(),
        teamId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, ...rest } = input;

        if (id) {
          return await ctx.prisma.project.update({
            where: {
              id,
            },
            data: {
              ...rest,
            },
          });
        }

        return await ctx.prisma.project.create({
          data: {
            ...rest,
          },
        });
      } catch (err) {
        console.log(err);
        throw err;
      }
    }),
});
