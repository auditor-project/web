/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { promisify } from "util";
import * as grpc from "@grpc/grpc-js";
import { parserHandlerService } from "./grpc-client";
import { type AuditStartRequest } from "~/proto/parser";
import { env } from "~/env.mjs";

export class AuditorService extends parserHandlerService {
  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super(env.PROCESSOR_SERVICE_HOST, grpc.credentials.createInsecure());
  }

  public async auditStartProcessor(data: AuditStartRequest) {
    const AuditStartProcessor = promisify(this.AuditStartProcessor).bind(this);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    return await AuditStartProcessor(data)
      .then((client: any) => ({ client, error: null }))
      .catch((error: never) => ({ error, client: null }));
  }
}
