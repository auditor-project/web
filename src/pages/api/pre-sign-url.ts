/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type NextApiRequest, type NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { fileContentTypes } from "~/utils/file-types";
import { type Conditions } from "@aws-sdk/s3-presigned-post/dist-types/types";
import { type PresignedPost } from "aws-sdk/clients/s3";
import { S3Client } from "@aws-sdk/client-s3";
import { env } from "~/env.mjs";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";

export const signedUrlExpireSeconds = 120;

const schema = z.object({
  fileName: z.string(),
  fileSize: z.number().optional(),
  action: z.enum(["signature", "code"]),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  if (method !== "POST") {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).json({
      /* eslint-disable @typescript-eslint/restrict-template-expressions */
      error: { message: `Method ${method} Not Allowed` },
    });
    return;
  }

  const response = schema.safeParse(req.body);

  if (!response.success) {
    const { errors } = response.error;

    return res.status(400).json({
      error: { message: "Invalid request", errors },
    });
  }

  const fileName = response.data.fileName.trim();
  const extension = fileName.substring(fileName.lastIndexOf("."));

  const uniqueFileName = uuidv4();
  const bucketFileName = `${uniqueFileName}${extension}`;

  const uploadFolder =
    response.data.action === "signature" ? "signatures" : "codes";
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const contentType = fileContentTypes[extension.toLowerCase()];

  const Conditions: Conditions[] = [
    ["content-length-range", 0, 3221225472], //3 GB
    ["eq", "$Content-Type", contentType],
    { acl: "public-read" },
  ];

  const s3Client = new S3Client({
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const Fields = {
    Key: `${uploadFolder}/${bucketFileName}`,
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const presignedPost: PresignedPost = await createPresignedPost(s3Client, {
    Bucket: env.BUCKET_NAME,
    Key: `${uploadFolder}/${bucketFileName}`,
    Conditions,
    Fields,
    Expires: signedUrlExpireSeconds,
  });

  res.status(200).json({
    uniqueFileName: uniqueFileName,
    fileExtension: extension,
    contentType: contentType,
    presignedPost,
    type: response.data.action,
    acl: "public-read",
    uploadKey: `${uploadFolder}/${bucketFileName}`,
  });
}
