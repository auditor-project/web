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

  upsert: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
        name: z.string(),
        description: z.string(),
        imageUrl: z.string(),
        users: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, users, ...rest } = input;

        if (!users.includes(ctx.session.user.id)) {
          users.push(ctx.session.user.id);
        }

        if (id) {
          return await ctx.prisma.team.update({
            where: {
              id,
            },
            data: {
              ...rest,
              users: {
                connect: users.map((id) => ({ id })),
              },
            },
          });
        }

        return await ctx.prisma.team.create({
          data: {
            ...rest,
            users: {
              connect: users.map((id) => ({ id })),
            },
          },
        });
      } catch (err) {
        console.log(err);
        throw err;
      }
    }),
});
