import { privateKeyToAccount, generatePrivateKey } from "viem/accounts";

/** Generates a random account. Can be used to generate a new owner for the safe */
const generateNewAccount = async () => {
  const privateKey = generatePrivateKey();
  const address = privateKeyToAccount(privateKey).address;
  return { privateKey, address };
};

generateNewAccount()
  .then((newAccount) => {
    console.log("New account address:    ", newAccount.address);
    console.log("New account private key:", newAccount.privateKey);
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
