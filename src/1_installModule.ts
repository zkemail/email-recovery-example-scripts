import {
  createWalletClient,
  encodeAbiParameters,
  http,
  parseEther,
  publicActions,
  toFunctionSelector,
  toHex,
} from "viem";
import config from "../config.ts";
import {
  getSmartAccountClient,
  pimlicoClient,
  getSafeAccount,
  publicClient,
  owner,
} from "./helpers/clients.ts";
import { computeGuardianAddress } from "./helpers/computeGuardianAddress.ts";
import { baseSepolia } from "viem/chains";
import { privateKeyToAccount, generatePrivateKey } from "viem/accounts";

const installModule = async () => {
  // Compute guardian address
  const guardianAddress = await computeGuardianAddress(
    config.accountCode as any,
    config.guardianEmail
  );
  console.log("guardianAddress", guardianAddress);

  const safeAccount = await getSafeAccount();
  const smartAccountClient = await getSmartAccountClient();

  const walletClient = createWalletClient({
    account: owner,
    chain: baseSepolia,
    transport: http(config.rpcUrl),
  }).extend(publicActions);

  await walletClient.sendTransaction({
    to: safeAccount.address,
    value: parseEther("0.0003"),
  });
  console.log("sent money to safe");

  const senderBalance = await publicClient.getBalance({
    address: safeAccount.address,
  });

  console.log("balance", senderBalance);

  const bytecode = await publicClient.getCode({
    address: safeAccount.address,
  });
  console.log("bytecode before tx", bytecode);

  // txHash
  const randomAccount = privateKeyToAccount(generatePrivateKey()).address;
  console.log("About to try send");
  await smartAccountClient.sendTransaction({
    to: randomAccount,
    value: parseEther("0.00001"),
  });

  const isModuleInstalled = await smartAccountClient.isModuleInstalled({
    address: config.addresses.universalEmailRecoveryModule,
    type: "executor",
    context: toHex(0),
  });
  console.log("isModuleInstalled", isModuleInstalled);

  if (isModuleInstalled) {
    console.log("Module already installed");
    return;
  }

  const randomAccountBalance = await publicClient.getBalance({
    address: randomAccount,
  });
  if (randomAccountBalance === 0n) {
    throw new Error("Failed to send transaction");
  }

  const account = safeAccount.address;
  console.log("account", account);
  const isInstalledContext = toHex(0);
  const functionSelector = toFunctionSelector(
    "swapOwner(address,address,address)"
  );
  const guardians = [guardianAddress];
  const guardianWeights = [1n];
  const threshold = 1n;
  const delay = 0n; // 0 seconds
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
      safeAccount.address,
      isInstalledContext,
      functionSelector,
      guardians,
      guardianWeights,
      threshold,
      delay,
      expiry,
    ]
  );
  console.log(
    account,
    isInstalledContext,
    functionSelector,
    guardians,
    guardianWeights,
    threshold,
    delay,
    expiry
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

installModule().catch((error) => {
  console.error(error);
  process.exit(1);
});
