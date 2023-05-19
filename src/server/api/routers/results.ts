import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const resultsRouter = createTRPCRouter({
  getResults: protectedProcedure
    .input(
      z.object({ projectId: z.string(), limit: z.number(), skip: z.number() })
    )
    .query(async ({ input, ctx }) => {
      const results = await ctx.prisma.results.findMany({
        skip: input.skip,
        take: input.limit,
        where: {
          projectId: input.projectId,
        },
      });
      const total = await ctx.prisma.results.count({
        where: {
          projectId: input.projectId,
        },
      });

      return {
        count: total,
        results,
      };
    }),

  getAnalytics: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ input, ctx }) => {
      const severityCounts = await ctx.prisma.results.groupBy({
        by: ["severity"],
        where: {
          projectId: input.projectId,
        },
        _count: {
          severity: true,
        },
      });

      const fileTypeCounts = await ctx.prisma.results.groupBy({
        by: ["filetype"],
        _count: {
          filetype: true,
        },
      });

      const matchStrCounts = await ctx.prisma.results.groupBy({
        by: ["matchStr"],
        _count: {
          matchStr: true,
        },
      });

      const severityResults = severityCounts.map((result) => ({
        type: result.severity,
        total: result._count.severity,
      }));

      const fileTypeResults = fileTypeCounts.map((result) => ({
        type: result.filetype,
        count: result._count.filetype,
      }));

      const matchStrResults = matchStrCounts.map((result) => ({
        type: result.matchStr,
        count: result._count.matchStr,
      }));

      return {
        severity: severityResults,
        fileTypes: fileTypeResults,
        hits: matchStrResults,
      };
    }),

  comments: protectedProcedure
    .input(z.object({ resultId: z.string() }))
    .query(({ input, ctx }) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      return ctx.prisma.comments.findMany({
        where: {
          resultsId: input.resultId,
        },
        include: {
          user: true,
        },
      });
    }),

  createComment: protectedProcedure
    .input(z.object({ resultId: z.string(), comment: z.string() }))
    .mutation(({ input, ctx }) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      return ctx.prisma.comments.create({
        data: {
          comment: input.comment,
          resultsId: input.resultId,
          userId: ctx.session.user.id,
        },
      });
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
