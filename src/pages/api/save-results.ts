/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type NextApiRequest, type NextApiResponse } from "next";
import { z } from "zod";
import { ProjectStatus } from "~/enum/project-status.enum";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";

const API_KEY_HEADER = "x-api-token";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "5000mb",
    },
  },
};

export const schema = z.object({
  projectId: z.string(),
  results: z.array(
    z.object({
      id: z.number(),
      file: z.string(),
      filetype: z.string(),
      search: z.string(),
      match_str: z.string(),
      hits: z.string(),
      line: z.number(),
      code: z.array(z.array(z.union([z.number(), z.string(), z.boolean()]))),
    })
  ),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, headers } = req;

  if (method !== "POST") {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).json({
      /* eslint-disable @typescript-eslint/restrict-template-expressions */
      error: { message: `Method ${method} Not Allowed` },
    });
    return;
  }

  if (headers[API_KEY_HEADER] !== env.BULK_SAVE_API_KEY) {
    res.status(401).json({
      error: { message: "Unauthorized" },
    });
  }

  console.log("==== saving results =====");

  const response = schema.safeParse(req.body);

  console.log(response);

  if (!response.success) {
    const { errors } = response.error;

    return res.status(400).json({
      error: { message: "Invalid request", errors },
    });
  }

  const results = response.data.results.map((result) => ({
    file: result.file,
    filetype: result.filetype,
    search: result.search,
    matchStr: result.match_str,
    hits: result.hits,
    line: result.line,
    code: result.code,
    projectId: response.data.projectId,
    severity: "not-marked",
  }));

  try {
    const data = await prisma.results.createMany({
      data: results,
    });

    await prisma.project.update({
      where: {
        id: response.data.projectId,
      },
      data: {
        currentStatus: ProjectStatus.COMPLETED,
      },
    });

    res.status(200).json({
      data,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: { message: "Internal server error", err },
    });
  }
}
