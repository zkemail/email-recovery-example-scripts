import { zeroAddress } from "viem";
import { safeAbi } from "../../abi/Safe.ts";
import { getSafeLaunchpadSetupData } from "../helpers/getSafeLaunchpadSetupData.ts";
import dotenv from "dotenv";
import config from "../../config.ts";
import { owner, eoaAccount, walletClient } from "./clients.ts";

// import { ownableValidator } from "./clients.ts";
dotenv.config();

const upgradeEOAWith7702 = async () => {
  const authorization = await walletClient.signAuthorization({
    contractAddress: config.addresses.safeSingletonAddress,
  });

  // Parameters for Safe's setup call.
  const owners = [owner.address];
  const signerThreshold = 1n;
  const setupAddress = config.addresses.erc7579LaunchpadAddress;
  const setupData = getSafeLaunchpadSetupData();
  const fallbackHandler = config.addresses.safe7579AdaptorAddress;
  const paymentToken = zeroAddress;
  const paymentValue = 0n;
  const paymentReceiver = zeroAddress;

  const txHash = await walletClient.writeContract({
    address: eoaAccount.address,
    abi: safeAbi,
    functionName: "setup",
    args: [
      owners,
      signerThreshold,
      setupAddress,
      setupData,
      fallbackHandler,
      paymentToken,
      paymentValue,
      paymentReceiver,
    ],
    authorizationList: [authorization],
  });
  console.log(`Submitted: https://odyssey-explorer.ithaca.xyz/tx/${txHash}`);
};

upgradeEOAWith7702()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
