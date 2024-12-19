import { privateKeyToAccount, generatePrivateKey } from "viem/accounts";

/** Generates a random account address. Can be used to generate a new owner for the safe */
const generateNewAccountAddress = async () => {
  return privateKeyToAccount(generatePrivateKey()).address;
};

generateNewAccountAddress()
  .then((newAccountAddress) =>
    console.log("New account address:", newAccountAddress)
  )
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
