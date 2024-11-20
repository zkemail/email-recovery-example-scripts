import { z } from "zod";


export const GetAccountSaltResponseSchema = z.custom<`0x${string}`>();
export type GetAccountSaltResponse = z.infer<typeof GetAccountSaltResponseSchema>;

export const HandleAcceptanceResponseSchema = z.object({
    requestId: z.number()
});
export type HandleAcceptanceResponse = z.infer<typeof HandleAcceptanceResponseSchema>;

export const HandleRecoveryResponseSchema = z.object({
    requestId: z.number()
});
export type HandleRecoveryResponse = z.infer<typeof HandleRecoveryResponseSchema>;

export const CompleteRecoveryResponseSchema = z.void();
export type CompleteRecoveryResponse = z.infer<typeof CompleteRecoveryResponseSchema>;