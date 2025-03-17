import { toFunctionSelector, toHex } from "viem";
import { getUniversalEmailRecoveryExecutor } from "@rhinestone/module-sdk";
import {
  getSafeAccount,
  getSmartAccountClient,
  ownableValidator,
  pimlicoClient,
  publicClient,
} from "./clients.ts";
import { baseSepolia } from "viem/chains";
import { computeGuardianAddress } from "../helpers/computeGuardianAddress.ts";
import config from "../../config.ts";

const installModule = async () => {
  const safeAccount = await getSafeAccount();
  const smartAccountClient = await getSmartAccountClient();

  const guardianAddress = await computeGuardianAddress(
    safeAccount.address,
    config.accountCode,
    config.guardianEmail
  );

  const bytecode = await publicClient.getCode({
    address: safeAccount.address,
  });
  if (bytecode) {
    const isModuleInstalled = await smartAccountClient.isModuleInstalled({
      address: config.addresses.universalEmailRecoveryModule,
      type: "executor",
      context: toHex(0),
    });
    if (isModuleInstalled) {
      console.log("Module already installed");
      return;
    }
  }

  const validator = ownableValidator.address;
  const isInstalledContext = toHex(0);
  const initialSelector = toFunctionSelector("setThreshold(uint256)");
  const guardians = [guardianAddress];
  const weights = [1n];
  const threshold = 1n;
  const delay = 6n * 60n * 60n; // 6 hours
  const expiry = 2n * 7n * 24n * 60n * 60n; // 2 weeks in seconds

  const emailRecovery = getUniversalEmailRecoveryExecutor({
    validator,
    isInstalledContext,
    initialSelector,
    guardians,
    weights,
    threshold,
    delay,
    expiry,
    chainId: baseSepolia.id,
  });

  emailRecovery.address = config.addresses.universalEmailRecoveryModule;
  emailRecovery.module = config.addresses.universalEmailRecoveryModule;

  const userOpHash = await smartAccountClient.installModule(emailRecovery);
  console.log("userOpHash", userOpHash);

  const receipt = await pimlicoClient.waitForUserOperationReceipt({
    hash: userOpHash,
  });
  console.log("transactionHash", receipt.receipt.transactionHash);
};

installModule()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
