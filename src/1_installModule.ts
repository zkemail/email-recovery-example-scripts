import {
  encodeAbiParameters,
  parseAbiParameters,
  toFunctionSelector,
  toHex,
} from "viem";
import config from "../config.ts";
import {
  smartAccountClient,
  pimlicoClient,
  safeAccount,
} from "./helpers/clients.ts";
import { computeGuardianAddress } from "./helpers/computeGuardianAddress.ts";

const installModule = async () => {
  // Compute guardian address
  const guardianAddress = await computeGuardianAddress(
    config.accountCode as `0x${string}`,
    config.guardianEmail
  );
  console.log("guardianAddress", guardianAddress);

  const account = safeAccount.address;
  console.log("account", account);
  const isInstalledContext = toHex(0);
  const functionSelector = toFunctionSelector(
    "swapOwner(address,address,address)"
  );
  const guardians = [guardianAddress];
  const guardianWeights = [1n];
  const threshold = 1n;
  const delay = 0n; // seconds
  const expiry = 2n * 7n * 24n * 60n * 60n; // 2 weeks in seconds

  const moduleData = encodeAbiParameters(
    parseAbiParameters(
      "address, bytes, bytes4, address[], uint256[], uint256, uint256, uint256"
    ),
    [
      account,
      isInstalledContext,
      functionSelector,
      guardians,
      guardianWeights,
      threshold,
      delay,
      expiry,
    ]
  );
  const userOpHash = await smartAccountClient.installModule({
    type: "executor",
    address: config.addresses.universalEmailRecoveryModule,
    context: moduleData,
  });

  const receipt = await pimlicoClient.waitForUserOperationReceipt({
    hash: userOpHash,
  });
  console.log("transactionHash", receipt.receipt.transactionHash);
};

installModule().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
