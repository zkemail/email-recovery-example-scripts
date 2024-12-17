import axios from "axios";
import {
  encodeAbiParameters,
  encodeFunctionData,
  parseAbiParameters,
  type Address,
} from "viem";
import { CompleteRecoveryResponseSchema } from "../types.ts";
import config from "../config.ts";
import { safeAbi } from "../abi/Safe.ts";
import { publicClient, owner, getSafeAccount } from "./helpers/clients.ts";
import { getPreviousOwnerInLinkedList } from "./helpers/getPreviousOwnerInLinkedList.ts";

const completeRecovery = async () => {
  const safeAccount = await getSafeAccount();

  const safeOwners = await publicClient.readContract({
    abi: safeAbi,
    address: safeAccount.address,
    functionName: "getOwners",
    args: [],
  });

  const oldOwner = owner.address;
  const previousOwnerInLinkedList = getPreviousOwnerInLinkedList(
    oldOwner,
    safeOwners
  );
  const newOwner = config.newOwner;

  const recoveryCallData = encodeFunctionData({
    abi: safeAbi,
    functionName: "swapOwner",
    // FIXME: "as"
    args: [previousOwnerInLinkedList, oldOwner, newOwner as Address],
  });

  const recoveryData = encodeAbiParameters(
    parseAbiParameters("address, bytes"),
    [safeAccount.address, recoveryCallData]
  );

  const completeRecoveryResponse = await axios({
    method: "POST",
    url: `${config.relayerApiUrl}/completeRequest`,
    data: {
      controller_eth_addr: config.addresses.universalEmailRecoveryModule,
      account_eth_addr: safeAccount.address,
      complete_calldata: recoveryData,
    },
  });
  CompleteRecoveryResponseSchema.parse(completeRecoveryResponse.data);
};

completeRecovery().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
