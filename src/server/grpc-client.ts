/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { join } from "path";

const PROTO_PATH = join(process.cwd(), "src/spec/parser.proto");

/**
 * Suggested options for similarity to loading grpc.load behavior.
 */
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  defaults: true,
  oneofs: true,
});

export const parserHandlerService = (
  grpc.loadPackageDefinition(packageDefinition) as unknown as any
).parser.ParserHandlerService;
