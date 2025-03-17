import { getAddress, isHex, type Address, type Hex } from "viem";
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
if (!isHex(process.env.OWNER_PRIVATE_KEY)) {
  throw new Error("OWNER_PRIVATE_KEY is not a valid hex string");
}
if (!process.env.EOA_PRIVATE_KEY) {
  throw new Error("EOA_PRIVATE_KEY does not exist");
}
if (!isHex(process.env.EOA_PRIVATE_KEY)) {
  throw new Error("EOA_PRIVATE_KEY is not a valid hex string");
}
if (!process.env.GUARDIAN_EMAIL) {
  throw new Error("GUARDIAN_EMAIL does not exist");
}
if (!process.env.ACCOUNT_CODE) {
  throw new Error("ACCOUNT_CODE does not exist");
}
if (!isHex(process.env.ACCOUNT_CODE)) {
  throw new Error("ACCOUNT_CODE is not a valid hex string");
}
if (!process.env.NEW_OWNER) {
  throw new Error("NEW_OWNER does not exist");
}
if (!process.env.SAFE_SALT_NONCE) {
  throw new Error("SAFE_SALT_NONCE does not exist");
}

type Config = {
  bundlerUrl: string;
  rpcUrl: string;
  relayerApiUrl: string;
  ownerPrivateKey: `0x${string}`;
  eoaPrivateKey: `0x${string}`;
  guardianEmail: string;
  accountCode: Hex;
  newOwner: Address;
  saltNonce: bigint;
  addresses: {
    universalEmailRecoveryModule: Address;
    safe4337ModuleAddress: Address;
    safe7579AdaptorAddress: Address;
    erc7579LaunchpadAddress: Address;
    attestor: Address;
    safeSingletonAddress: Address;
    safeL2SingletonAddress: Address;
    safeModuleSetupAddress: Address;
    safeMultiSendAddress: Address;
    rhinestoneAttestor: Address;
  };
};

const config: Config = {
  bundlerUrl: `https://api.pimlico.io/v2/11155111/rpc?apikey=${process.env.PIMLICO_API_KEY}`,
  rpcUrl: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
  relayerApiUrl: `${process.env.RELAYER_URL}`,
  ownerPrivateKey: process.env.OWNER_PRIVATE_KEY,
  eoaPrivateKey: process.env.EOA_PRIVATE_KEY,
  guardianEmail: `${process.env.GUARDIAN_EMAIL}`,
  accountCode: `${process.env.ACCOUNT_CODE}`,
  newOwner: getAddress(process.env.NEW_OWNER),
  saltNonce: BigInt(process.env.SAFE_SALT_NONCE),
  addresses: {
    universalEmailRecoveryModule: "0x636632FA22052d2a4Fb6e3Bab84551B620b9C1F9",
    safe4337ModuleAddress: "0x7579EE8307284F293B1927136486880611F20002",
    safe7579AdaptorAddress: "0x7579EE8307284F293B1927136486880611F20002",
    erc7579LaunchpadAddress: "0x7579011aB74c46090561ea277Ba79D510c6C00ff",
    attestor: "0xA4C777199658a41688E9488c4EcbD7a2925Cc23A",
    safeSingletonAddress: "0x41675c099f32341bf84bfc5382af534df5c7461a",
    safeL2SingletonAddress: "0x29fcb43b46531bca003ddc8fcb67ffe91900c762",
    safeModuleSetupAddress: "0x2dd68b007B46fBe91B9A7c3EDa5A7a1063cB5b47",
    safeMultiSendAddress: "0x38869bf66a61cF6bDB996A6aE40D5853Fd43B526",
    rhinestoneAttestor: "0xaed4d8baa80948d54d33de041513d30124e1ae3f",
  },
};

const odysseyConfig: Config = {
  bundlerUrl: `https://api.pimlico.io/v2/911867/rpc?apikey=${process.env.PIMLICO_API_KEY}`,
  rpcUrl: `https://odyssey.ithaca.xyz`,
  relayerApiUrl: `${process.env.RELAYER_URL}`,
  ownerPrivateKey: process.env.OWNER_PRIVATE_KEY,
  eoaPrivateKey: process.env.EOA_PRIVATE_KEY,
  guardianEmail: `${process.env.GUARDIAN_EMAIL}`,
  accountCode: `${process.env.ACCOUNT_CODE}`,
  newOwner: getAddress(process.env.NEW_OWNER),
  saltNonce: BigInt(process.env.SAFE_SALT_NONCE),
  addresses: {
    universalEmailRecoveryModule: "0x3692eb803f5fBaca90097d20F6cF4AC01aFc8847",
    safe4337ModuleAddress: "0x75cf11467937ce3F2f357CE24ffc3DBF8fD5c226",
    safe7579AdaptorAddress: "0x7579EE8307284F293B1927136486880611F20002",
    erc7579LaunchpadAddress: "0x7579011aB74c46090561ea277Ba79D510c6C00ff",
    attestor: "0xA4C777199658a41688E9488c4EcbD7a2925Cc23A",
    safeSingletonAddress: "0x41675C099F32341bf84BFc5382aF534df5C7461a",
    safeL2SingletonAddress: "0x29fcB43b46531BcA003ddC8FCB67FFE91900C762",
    safeModuleSetupAddress: "0x2dd68b007B46fBe91B9A7c3EDa5A7a1063cB5b47",
    safeMultiSendAddress: "0x38869bf66a61cF6bDB996A6aE40D5853Fd43B526",
    rhinestoneAttestor: "0xaed4d8baa80948d54d33de041513d30124e1ae3f",
  },
};

export default config;
