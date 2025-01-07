# ZK Email Recovery Module example scripts

This repository contains example scripts for the ZK Email Recovery Module used with a Safe account on Base Sepolia. There are 4 main scripts that should be run in order to complete the recovery module e2e flow.

## Getting Started

```bash
# Install dependencies
yarn
```

```bash
# Copy the .env.example file to .env and fill out the values
cp .env.example .env
```

For `ACCOUNT_CODE` and `NEW_OWNER_ADDRESS` you can use the helper scripts

## Scripts

_**Note**: If you need an account code or a fresh new owner address, run the helper scripts detailed at the bottom of this README first._

### Deploy account and install the module

`1_installModule.ts` - Deploys the Safe account and installs the module. This step only needs to be completed once and handles configuration such as guardians, number of guardians, threshold, etc.

```bash
yarn install-module
```

### Handle Acceptance

`2_handleAcceptance.ts` - Handle acceptance is essentially a validation step that must be executed before a guardian can be used. Handle acceptance only needs to be called once for each guardian. This step is used to confirm directly with each guardian that they consent to be a guardian. This is important to ensure there are no typos when entering a guardian email in frontends, and that the guardian is in control of the specific email address. This prevents broken recovery setups down the line.

_**Note:** Once you run the handle acceptance script, your configured guardian will recieve an email which must be replied to with the single command "**Confirm**" to confirm their acceptance._

```bash
yarn handle-acceptance
```

### Handle Recovery

`3_handleRecovery.ts` - Handle recovery is the script that is used to initiate a recovery request. In between steps 2 and 3 is where the account owner has lost their private key/phone. Handle recovery is called for each configured and accepted guardian until the threshold is met.

_**Note:** Once you run the handle recovery script, your configured guardian will recieve an email which must be replied to with the single command "**Confirm**" to confirm they approve the recovery request._

```bash
yarn handle-recovery
```

### Complete Recovery

`4_completeRecovery.ts` - Complete recovery is the final step in the recovery process, it is at this stage where the Safe owner address is rotated. The reason it is separated from step 3 is that having a final confirmation allows developers to implement a timelock which is an important security feature to protect against malicious recovery attempts. An account owner can cancel a recovery request during the timelock period if they still possess their method of authentication. The timelock in these scripts is set to zero, so complete recovery can be called straight after handle recovery.

```bash
yarn complete-recovery
```

## Helper scripts

Then there are 2 helpers:

### Generate an account code

`generateAccountCode.ts` - Generates an account code. The account code is a random integer that is combined with a guardian email to form the account salt: `guardianAddr := CREATE2(hash(guardianEmailAddr, accountCode))`. The code is only shared with the guardian via email. The `CREATE2` account salt is used to generate deterministic guardian addresses while preserving email privacy onchain.

```bash
yarn generate-account-code
```

### Generate a new owner address

`generateNewAccountAddress.ts` - Generates a fresh Ethereum address. Can be used to generate a new owner address for the Safe account.

```bash
yarn generate-address
```
