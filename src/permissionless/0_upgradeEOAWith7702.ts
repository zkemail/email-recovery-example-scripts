import { createWalletClient, type Hex, http, zeroAddress } from "viem";
import { privateKeyToAccount, privateKeyToAddress } from "viem/accounts";
import { odysseyTestnet, sepolia } from "viem/chains";
import { eip7702Actions } from "viem/experimental";
import { safeAbiImplementation } from "../../abi/Safe_2.ts";
import { getSafeLaunchpadSetupData } from "../helpers/getSafeLaunchpadSetupData.ts";

import dotenv from "dotenv";
import config from "../../config.ts";
import { owner } from "./clients.ts";
dotenv.config();

const account = privateKeyToAccount(config.eoaPrivateKey);

const walletClient = createWalletClient({
  account,
  chain: sepolia,
  transport: http(config.rpcUrl),
}).extend(eip7702Actions());

const upgradeEOAWith7702 = async () => {
  const authorization = await walletClient.signAuthorization({
    contractAddress: config.addresses.safeSingletonAddress,
  });

  // Parameters for Safe's setup call.
  const owners = [owner.address];
  const signerThreshold = 1n;
  const setupAddress = config.addresses.erc7569LaunchpadAddress;
  const setupData = getSafeLaunchpadSetupData();
  const fallbackHandler = config.addresses.safe7579AdaptorAddress;
  const paymentToken = zeroAddress;
  const paymentValue = 0n;
  const paymentReceiver = zeroAddress;

  const txHash = await walletClient.writeContract({
    address: account.address,
    abi: safeAbiImplementation,
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
