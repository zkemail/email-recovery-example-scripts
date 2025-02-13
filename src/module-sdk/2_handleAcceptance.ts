import axios from "axios";
import { universalEmailRecoveryModuleAbi } from "../../abi/UniversalEmailRecoveryModule.ts";
import { HandleAcceptanceResponseSchema } from "../types.ts";
import { getSafeAccount, publicClient } from "./clients.ts";
import config from "../../config.ts";

const handleAcceptance = async () => {
  const safeAccount = await getSafeAccount();

  const acceptanceCommandTemplates = await publicClient.readContract({
    abi: universalEmailRecoveryModuleAbi,
    address: config.addresses.universalEmailRecoveryModule,
    functionName: "acceptanceCommandTemplates",
    args: [],
  });

  const templateIdx = 0;
  const handleAcceptanceCommand = acceptanceCommandTemplates[0]
    ?.join()
    .replaceAll(",", " ")
    .replace("{ethAddr}", safeAccount.address);

  const handleAcceptanceResponse = await axios({
    method: "POST",
    url: `${config.relayerApiUrl}/acceptanceRequest`,
    data: {
      controller_eth_addr: config.addresses.universalEmailRecoveryModule,
      guardian_email_addr: config.guardianEmail,
      account_code: config.accountCode.slice(2),
      template_idx: templateIdx,
      command: handleAcceptanceCommand,
    },
  });

  console.log("Request status:", handleAcceptanceResponse.status);
  if (handleAcceptanceResponse.status === 200) {
    const { request_id: handleAcceptanceRequestId } =
      HandleAcceptanceResponseSchema.parse(handleAcceptanceResponse.data);
    console.log("Request ID:", handleAcceptanceRequestId);
  }
};

handleAcceptance()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
