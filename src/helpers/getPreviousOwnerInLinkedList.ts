import type { Address } from "viem";

/** Helper function to get the previous owner in the Safe account owners linked list */
export const getPreviousOwnerInLinkedList = (
  oldOwner: Address,
  allOwners: readonly Address[]
): Address => {
  const length = allOwners.length;

  let oldOwnerIndex = 0;
  for (let i = 0; i < length; i++) {
    if (allOwners[i] === oldOwner) {
      oldOwnerIndex = i;
      break;
    }
  }

  let previousOwnerInLinkedList = allOwners[oldOwnerIndex - 1];
  if (previousOwnerInLinkedList === undefined) {
    // It's possible that the previous owner is undefined, setting it to an empty address here so typescript doesn't complain
    previousOwnerInLinkedList = "0x0000000000000000000000000000000000000000";
    if (oldOwnerIndex !== 0) {
      throw new Error("previousOwnerInLinkedList is undefined");
    }
  }

  const sentinelOwner: Address = "0x0000000000000000000000000000000000000001";
  return oldOwnerIndex === 0 ? sentinelOwner : previousOwnerInLinkedList;
};
