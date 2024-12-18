import axios from "axios";
import { universalEmailRecoveryModuleAbi } from "../abi/UniversalEmailRecoveryModule.ts";
import { HandleRecoveryResponseSchema } from "../types.ts";
import { getSafeAccount, owner, publicClient } from "./helpers/clients.ts";
import config from "../config.ts";
import {
  encodeAbiParameters,
  encodeFunctionData,
  keccak256,
  parseAbiParameters,
  type Address,
} from "viem";
import { getPreviousOwnerInLinkedList } from "./helpers/getPreviousOwnerInLinkedList.ts";
import { safeAbi } from "../abi/Safe.ts";

const handleRecovery = async () => {
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
  console.log("processRecoveryCommand", processRecoveryCommand);

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
  console.log("REQUEST STATUS", handleRecoveryResponse.status);
  // const { requestId: handleRecoveryRequestId } =
  //   HandleRecoveryResponseSchema.parse(handleRecoveryResponse.data);
};

handleRecovery().catch((error) => {
  console.error(error);
  process.exit(1);
});
