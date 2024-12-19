import { z } from "zod";

export const GetAccountSaltResponseSchema = z.custom<`0x${string}`>();
export type GetAccountSaltResponse = z.infer<
  typeof GetAccountSaltResponseSchema
>;

export const HandleAcceptanceResponseSchema = z.object({
  request_id: z.number(),
  command_params: z.array(z.object({ EthAddr: z.string() })),
});
export type HandleAcceptanceResponse = z.infer<
  typeof HandleAcceptanceResponseSchema
>;

export const HandleRecoveryResponseSchema = z.object({
  request_id: z.number(),
  command_params: z.tuple([
    z.object({ EthAddr: z.string() }),
    z.object({ String: z.string() }),
  ]),
});
export type HandleRecoveryResponse = z.infer<
  typeof HandleRecoveryResponseSchema
>;

export const CompleteRecoveryResponseSchema = z.string();
export type CompleteRecoveryResponse = z.infer<
  typeof CompleteRecoveryResponseSchema
>;
