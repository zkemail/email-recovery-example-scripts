import axios from "axios";
import {
  encodeAbiParameters,
  encodeFunctionData,
  parseAbiParameters,
} from "viem";
import { CompleteRecoveryResponseSchema } from "./types.ts";
import config from "../config.ts";
import { safeAbi } from "../abi/Safe.ts";
import { publicClient, owner, getSafeAccount } from "./clients.ts";
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
    args: [previousOwnerInLinkedList, oldOwner, newOwner],
  });

  const recoveryData = encodeAbiParameters(
    parseAbiParameters("address, bytes"),
    [safeAccount.address, recoveryCallData]
  );

  const completeRecoveryResponse = await axios({
    method: "POST",
    url: `${config.relayerApiUrl}/completeRequest`,
    data: {
      account_eth_addr: safeAccount.address,
      controller_eth_addr: config.addresses.universalEmailRecoveryModule,
      complete_calldata: recoveryData,
    },
  });

  console.log("Request status:", completeRecoveryResponse.status);
  if (completeRecoveryResponse.status === 200) {
    const completeRecoveryResponseData = CompleteRecoveryResponseSchema.parse(
      completeRecoveryResponse.data
    );
    console.log("Result:", completeRecoveryResponseData);
  }
};

completeRecovery()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
