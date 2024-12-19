import { buildPoseidon } from "circomlibjs";
import { bytesToHex } from "viem";

/** Generates a random account code */
const generateAccountCode = async () => {
  const poseidon = await buildPoseidon();
  const accountCodeBytes: Uint8Array = poseidon.F.random();
  return bytesToHex(accountCodeBytes.reverse());
};

generateAccountCode()
  .then((accountCode) => console.log("Account code:", accountCode))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
