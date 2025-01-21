import { encodeAbiParameters, toFunctionSelector, toHex } from "viem";
import config from "../config.ts";
import {
  getSmartAccountClient,
  pimlicoClient,
  getSafeAccount,
  publicClient,
} from "./clients.ts";
import { computeGuardianAddress } from "./helpers/computeGuardianAddress.ts";

const installModule = async () => {
  const guardianAddress = await computeGuardianAddress(
    config.accountCode,
    config.guardianEmail
  );

  const safeAccount = await getSafeAccount();
  const smartAccountClient = await getSmartAccountClient();

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

  const validator = safeAccount.address;
  const isInstalledContext = toHex(0);
  const functionSelector = toFunctionSelector(
    "swapOwner(address,address,address)"
  );
  const guardians = [guardianAddress];
  const guardianWeights = [1n];
  const threshold = 1n;
  const delay = 6n * 60n * 60n; // 6 hours
  const expiry = 2n * 7n * 24n * 60n * 60n; // 2 weeks in seconds

  const moduleData = encodeAbiParameters(
    [
      { name: "validator", type: "address" },
      { name: "isInstalledContext", type: "bytes" },
      { name: "initialSelector", type: "bytes4" },
      { name: "guardians", type: "address[]" },
      { name: "weights", type: "uint256[]" },
      { name: "delay", type: "uint256" },
      { name: "expiry", type: "uint256" },
      { name: "threshold", type: "uint256" },
    ],
    [
      validator,
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
    account: safeAccount,
  });
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
