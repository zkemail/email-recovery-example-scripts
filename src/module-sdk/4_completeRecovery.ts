import axios from "axios";
import {
  encodeAbiParameters,
  encodeFunctionData,
  parseAbi,
  parseAbiParameters,
} from "viem";
import { CompleteRecoveryResponseSchema } from "../types.ts";
import config from "../../config.ts";
import { publicClient, getSafeAccount } from "./clients.ts";
import { universalEmailRecoveryModuleAbi } from "../../abi/UniversalEmailRecoveryModule.ts";
import { OWNABLE_VALIDATOR_ADDRESS } from "@rhinestone/module-sdk";

const completeRecovery = async () => {
  const safeAccount = await getSafeAccount();

  const recoveryRequest = await publicClient.readContract({
    abi: universalEmailRecoveryModuleAbi,
    address: config.addresses.universalEmailRecoveryModule,
    functionName: "getRecoveryRequest",
    args: [safeAccount.address],
  });

  const block = await publicClient.getBlock();
  if (recoveryRequest.executeAfter == 0n) {
    throw new Error("Recovery request for account not found");
  }

  if (block.timestamp < recoveryRequest.executeAfter) {
    const timeLeft = recoveryRequest.executeAfter - block.timestamp;
    throw new Error(
      `Recovery delay has not passed. You have ${timeLeft} seconds left.`
    );
  }

  const ownableValidatorAbi = parseAbi([
    "function setThreshold(uint256 _threshold) external",
  ]);
  const recoveryCallData = encodeFunctionData({
    abi: ownableValidatorAbi,
    functionName: "setThreshold",
    args: [1n],
  });

  const recoveryData = encodeAbiParameters(
    parseAbiParameters("address, bytes"),
    [OWNABLE_VALIDATOR_ADDRESS, recoveryCallData]
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
