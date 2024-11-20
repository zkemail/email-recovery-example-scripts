export const safeRecoveryCommandHandler = [
    {
      "type": "function",
      "name": "acceptanceSubjectTemplates",
      "inputs": [],
      "outputs": [
        { "name": "", "type": "string[][]", "internalType": "string[][]" }
      ],
      "stateMutability": "pure"
    },
    {
      "type": "function",
      "name": "extractRecoveredAccountFromAcceptanceSubject",
      "inputs": [
        {
          "name": "subjectParams",
          "type": "bytes[]",
          "internalType": "bytes[]"
        },
        { "name": "", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
      "stateMutability": "pure"
    },
    {
      "type": "function",
      "name": "extractRecoveredAccountFromRecoverySubject",
      "inputs": [
        {
          "name": "subjectParams",
          "type": "bytes[]",
          "internalType": "bytes[]"
        },
        { "name": "", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
      "stateMutability": "pure"
    },
    {
      "type": "function",
      "name": "parseRecoveryDataHash",
      "inputs": [
        { "name": "templateIdx", "type": "uint256", "internalType": "uint256" },
        {
          "name": "subjectParams",
          "type": "bytes[]",
          "internalType": "bytes[]"
        }
      ],
      "outputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "recoverySubjectTemplates",
      "inputs": [],
      "outputs": [
        { "name": "", "type": "string[][]", "internalType": "string[][]" }
      ],
      "stateMutability": "pure"
    },
    {
      "type": "function",
      "name": "selector",
      "inputs": [],
      "outputs": [{ "name": "", "type": "bytes4", "internalType": "bytes4" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "validateAcceptanceSubject",
      "inputs": [
        { "name": "templateIdx", "type": "uint256", "internalType": "uint256" },
        {
          "name": "subjectParams",
          "type": "bytes[]",
          "internalType": "bytes[]"
        }
      ],
      "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
      "stateMutability": "pure"
    },
    {
      "type": "function",
      "name": "validateRecoverySubject",
      "inputs": [
        { "name": "templateIdx", "type": "uint256", "internalType": "uint256" },
        {
          "name": "subjectParams",
          "type": "bytes[]",
          "internalType": "bytes[]"
        }
      ],
      "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
      "stateMutability": "view"
    },
    {
      "type": "error",
      "name": "InvalidNewOwner",
      "inputs": [
        { "name": "newOwner", "type": "address", "internalType": "address" }
      ]
    },
    {
      "type": "error",
      "name": "InvalidOldOwner",
      "inputs": [
        { "name": "oldOwner", "type": "address", "internalType": "address" }
      ]
    },
    {
      "type": "error",
      "name": "InvalidSubjectParams",
      "inputs": [
        {
          "name": "paramsLength",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "expectedParamsLength",
          "type": "uint256",
          "internalType": "uint256"
        }
      ]
    },
    {
      "type": "error",
      "name": "InvalidTemplateIndex",
      "inputs": [
        { "name": "templateIdx", "type": "uint256", "internalType": "uint256" },
        {
          "name": "expectedTemplateIdx",
          "type": "uint256",
          "internalType": "uint256"
        }
      ]
    }
  ] as const;