import axios from "axios";
import { universalEmailRecoveryModuleAbi } from "../../abi/UniversalEmailRecoveryModule.ts";
import { HandleRecoveryResponseSchema } from "../types.ts";
import { getSafeAccount, publicClient } from "./clients.ts";
import config from "../../config.ts";
import {
  encodeAbiParameters,
  encodeFunctionData,
  keccak256,
  parseAbi,
  parseAbiParameters,
} from "viem";
import { OWNABLE_VALIDATOR_ADDRESS } from "@rhinestone/module-sdk";

const handleRecovery = async () => {
  const safeAccount = await getSafeAccount();

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

  const templateIdx = 0;
  const recoveryCommandTemplates = await publicClient.readContract({
    abi: universalEmailRecoveryModuleAbi,
    address: config.addresses.universalEmailRecoveryModule,
    functionName: "recoveryCommandTemplates",
    args: [],
  });

  const safeAccountAddress = safeAccount.address;
  const recoveryDataHash = keccak256(recoveryData);

  const processRecoveryCommand = recoveryCommandTemplates[0]
    ?.join()
    .replaceAll(",", " ")
    .replace("{ethAddr}", safeAccountAddress)
    .replace("{string}", recoveryDataHash);

  const handleRecoveryResponse = await axios({
    method: "POST",
    url: `${config.relayerApiUrl}/recoveryRequest`,
    data: {
      controller_eth_addr: config.addresses.universalEmailRecoveryModule,
      guardian_email_addr: config.guardianEmail,
      template_idx: templateIdx,
      command: processRecoveryCommand,
    },
  });

  console.log("Request status:", handleRecoveryResponse.status);
  if (handleRecoveryResponse.status === 200) {
    const { request_id: handleRecoveryRequestId } =
      HandleRecoveryResponseSchema.parse(handleRecoveryResponse.data);
    console.log("Request ID:", handleRecoveryRequestId);
  }
};

handleRecovery()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
