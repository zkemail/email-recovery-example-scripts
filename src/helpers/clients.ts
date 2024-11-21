import {
  type PimlicoClient,
  createPimlicoClient,
} from "permissionless/clients/pimlico";
import {
  createPublicClient,
  http,
  type Chain,
  type Client,
  type RpcSchema,
  type Transport,
} from "viem";
import {
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
import { baseSepolia } from "viem/chains";

export const publicClient = createPublicClient({
  transport: http(config.rpcUrl),
});

export const pimlicoClient: PimlicoClient = createPimlicoClient({
  transport: http(config.bundlerUrl),
  entryPoint: {
    address: entryPoint07Address,
    version: "0.7",
  },
});

export const owner = privateKeyToAccount(config.ownerPrivateKey);

export const safeAccount: SmartAccount<SafeSmartAccountImplementation> =
  await toSafeSmartAccount({
    client: publicClient,
    owners: [owner],
    version: "1.4.1",
    entryPoint: {
      address: entryPoint07Address,
      version: "0.7",
    },
    safe4337ModuleAddress: config.addresses.safe4337ModuleAddress,
    erc7579LaunchpadAddress: config.addresses.erc7569LaunchpadAddress,
    // TODO: uncomment when someone has attested
    // attesters: [config.addresses.attestor], // This address belongs to Rhinestone. By designating them as attesters, you authorize that only modules explicitly approved by Rhinestone can be installed on your safe.
    // attestersThreshold: 1,
  });

export const smartAccountClient: Client<
  Transport,
  Chain,
  SmartAccount,
  RpcSchema
> &
  Erc7579Actions<SmartAccount<SafeSmartAccountImplementation>> =
  createSmartAccountClient({
    account: safeAccount,
    chain: baseSepolia,
    bundlerTransport: http(config.bundlerUrl),
    paymaster: pimlicoClient,
    userOperation: {
      estimateFeesPerGas: async () => {
        return (await pimlicoClient.getUserOperationGasPrice()).fast;
      },
    },
  }).extend(erc7579Actions());
