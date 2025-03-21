import axios from "axios";
import { universalEmailRecoveryModuleAbi } from "../../abi/UniversalEmailRecoveryModule.ts";
import { GetAccountSaltResponseSchema } from "../types.ts";
import config from "../../config.ts";
import { createPublicClient, http, type Address, type Hex } from "viem";
import { baseSepolia } from "viem/chains";

/** Computes the guardian address for a given account code and guardian email */
export const computeGuardianAddress = async (
  account: Address,
  accountCode: Hex,
  guardianEmail: string
) => {
  const publicClient = createPublicClient({
    transport: http(config.rpcUrl),
    chain: baseSepolia,
  });

  const getAccountSaltResponse = await axios({
    method: "POST",
    url: `${config.relayerApiUrl}/getAccountSalt`,
    data: {
      account_code: accountCode.slice(2),
      email_addr: guardianEmail,
    },
  });
  const guardianSalt = GetAccountSaltResponseSchema.parse(
    getAccountSaltResponse.data
  );

  // The guardian address is generated by sending the user's account address and guardian salt to the computeEmailAuthAddress function
  return await publicClient.readContract({
    abi: universalEmailRecoveryModuleAbi,
    address: config.addresses.universalEmailRecoveryModule,
    functionName: "computeEmailAuthAddress",
    args: [account, guardianSalt],
  });
};
