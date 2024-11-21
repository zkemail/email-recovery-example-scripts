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
  bundlerUrl: `https://api.pimlico.io/v2/basesepolia/rpc?apikey=${process.env.PIMLICO_API_KEY}`,
  rpcUrl: `https://base-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
  relayerApiUrl: `${process.env.RELAYER_URL}`,
  ownerPrivateKey: `0x${process.env.OWNER_PRIVATE_KEY}`,
  guardianEmail: `${process.env.GUARDIAN_EMAIL}`,
  accountCode: `${process.env.ACCOUNT_CODE}`,
  newOwner: `${process.env.NEW_OWNER}`,
  addresses: {
    universalEmailRecoveryModule: "0xF78025F23420AE9B9EA177c70c0A3c871E936d22",
    safe4337ModuleAddress: "0x75cf11467937ce3F2f357CE24ffc3DBF8fD5c226",
    erc7569LaunchpadAddress: "0x7579011aB74c46090561ea277Ba79D510c6C00ff",
    attestor: "0x000000333034E9f539ce08819E12c1b8Cb29084d",
  },
};

export default config;
