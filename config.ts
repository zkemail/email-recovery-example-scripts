import { type Address } from "viem";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.PIMLICO_API_KEY) {
  throw new Error("PIMLICO_API_KEY does not exist");
}
if (!process.env.ALCHEMY_API_KEY) {
  throw new Error("ALCHEMY_API_KEY does not exist");
}
if (!process.env.RELAYER_URL) {
  throw new Error("RELAYER_URL does not exist");
}
if (!process.env.OWNER_PRIVATE_KEY) {
  throw new Error("OWNER_PRIVATE_KEY does not exist");
}
if (!process.env.GUARDIAN_EMAIL) {
  throw new Error("GUARDIAN_EMAIL does not exist");
}
if (!process.env.ACCOUNT_CODE) {
  throw new Error("ACCOUNT_CODE does not exist");
}
if (!process.env.NEW_OWNER) {
  throw new Error("NEW_OWNER does not exist");
}

type Config = {
  bundlerUrl: string;
  rpcUrl: string;
  relayerApiUrl: string;
  ownerPrivateKey: `0x${string}`;
  guardianEmail: string;
  accountCode: string;
  newOwner: string;
  addresses: {
    universalEmailRecoveryModule: Address;
    safe4337ModuleAddress: Address;
    erc7569LaunchpadAddress: Address;
    attestor: Address;
  };
};

const config: Config = {
  bundlerUrl: `https://api.pimlico.io/v2/base-sepolia/rpc?apikey=${process.env.PIMLICO_API_KEY}`,
  rpcUrl: `https://base-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
  relayerApiUrl: `${process.env.RELAYER_URL}`,
  ownerPrivateKey: `0x${process.env.OWNER_PRIVATE_KEY}`,
  guardianEmail: `${process.env.GUARDIAN_EMAIL}`,
  accountCode: `${process.env.ACCOUNT_CODE}`,
  newOwner: `${process.env.NEW_OWNER}`,
  addresses: {
    universalEmailRecoveryModule: "0x72FbA28445187A0a95D2d463e5eab385689F3648",
    safe4337ModuleAddress: "0x7579EE8307284F293B1927136486880611F20002",
    erc7569LaunchpadAddress: "0x7579011aB74c46090561ea277Ba79D510c6C00ff",
    attestor: "0x000000000069E2a187AEFFb852bF3cCdC95151B2",
  },
};

export default config;
