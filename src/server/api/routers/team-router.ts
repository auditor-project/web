/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const teamRouter = createTRPCRouter({
  myTeams: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.team.findMany({
      where: {
        users: {
          some: {
            id: ctx.session.user.id,
          },
        },
      },
    });
  }),

  searchMembers: protectedProcedure
    .input(z.object({ email: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.user.findFirst({
        where: {
          email: input.email,
        },
        select: {
          image: true,
          id: true,
          name: true,
        },
      });
    }),
});
