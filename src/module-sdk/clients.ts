import {
  type PimlicoClient,
  createPimlicoClient,
} from "permissionless/clients/pimlico";
import {
  createPublicClient,
  createWalletClient,
  http,
  type Chain,
  type Client,
  type PublicClient,
  type RpcSchema,
  type Transport,
} from "viem";
import {
  createPaymasterClient,
  entryPoint07Address,
  type SmartAccount,
} from "viem/account-abstraction";
import config from "../../config.ts";
import {
  toSafeSmartAccount,
  type SafeSmartAccountImplementation,
} from "permissionless/accounts";
import { privateKeyToAccount } from "viem/accounts";
import { createSmartAccountClient } from "permissionless";
import {
  erc7579Actions,
  type Erc7579Actions,
} from "permissionless/actions/erc7579";
import { baseSepolia, odysseyTestnet, sepolia } from "viem/chains";
import { getOwnableValidator } from "@rhinestone/module-sdk";
import { eip7702Actions } from "viem/experimental";

export const publicClient: PublicClient = createPublicClient({
  transport: http(config.rpcUrl),
  chain: sepolia,
});

export const pimlicoClient: PimlicoClient = createPimlicoClient({
  transport: http(config.bundlerUrl),
  entryPoint: {
    address: entryPoint07Address,
    version: "0.7",
  },
  chain: sepolia,
});

export const owner = privateKeyToAccount(config.ownerPrivateKey);
export const newOwner = config.newOwner;

export const ownableValidator = getOwnableValidator({
  owners: [owner.address, newOwner],
  threshold: 2,
});

export const eoaAccount = privateKeyToAccount(config.eoaPrivateKey);

export const walletClient = createWalletClient({
  account: eoaAccount,
  chain: sepolia,
  transport: http(config.rpcUrl),
}).extend(eip7702Actions());

export const getSafeAccount = async (): Promise<
  SmartAccount<SafeSmartAccountImplementation>
> => {
  return await toSafeSmartAccount({
    address: eoaAccount.address,
    client: publicClient,
    owners: [owner],
    version: "1.4.1",
    entryPoint: {
      address: entryPoint07Address,
      version: "0.7",
    },
    safe4337ModuleAddress: config.addresses.safe7579AdaptorAddress,
    erc7579LaunchpadAddress: config.addresses.erc7579LaunchpadAddress,
    attesters: [config.addresses.attestor],
    attestersThreshold: 1,
    validators: [
      {
        address: ownableValidator.address,
        context: ownableValidator.initData,
      },
    ],
  });
};

export const getSmartAccountClient = async (): Promise<
  Client<Transport, Chain, SmartAccount, RpcSchema> &
    Erc7579Actions<SmartAccount<SafeSmartAccountImplementation>>
> => {
  return createSmartAccountClient({
    account: await getSafeAccount(),
    chain: sepolia,
    bundlerTransport: http(config.bundlerUrl),
    paymaster: pimlicoClient,
    userOperation: {
      estimateFeesPerGas: async () => {
        return (await pimlicoClient.getUserOperationGasPrice()).fast;
      },
    },
  }).extend(erc7579Actions());
};
