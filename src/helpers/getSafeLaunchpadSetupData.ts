import { encodeFunctionData, encodePacked, parseAbi, size } from "viem";
import config from "../../config.ts";

export const getSafeLaunchpadSetupData = () => {
  const erc7569LaunchpadCallData = encodeFunctionData({
    abi: parseAbi([
      "struct ModuleInit {address module;bytes initData;}",
      "function addSafe7579(address safe7579,ModuleInit[] calldata validators,ModuleInit[] calldata executors,ModuleInit[] calldata fallbacks, ModuleInit[] calldata hooks,address[] calldata attesters,uint8 threshold) external",
    ]),
    functionName: "addSafe7579",
    args: [
      config.addresses.safe7579AdaptorAddress,
      [],
      [],
      [],
      [],
      [config.addresses.attestor],
      1,
    ],
  });

  return erc7569LaunchpadCallData;
};
