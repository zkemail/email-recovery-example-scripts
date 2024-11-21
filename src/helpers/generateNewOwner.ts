import { privateKeyToAccount, generatePrivateKey } from "viem/accounts";

const generateNewOwner = async () => {
  return privateKeyToAccount(generatePrivateKey()).address;
};

generateNewOwner()
  .then((newOwner) => console.log("New owner:", newOwner))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
