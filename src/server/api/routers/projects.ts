/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

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
