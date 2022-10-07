/**
 * @public
 * Type for index sugbraph endpoints by chain ID.
 */
 export type SubgraphBook = {
  [key: number]: string;
};

/**
 * @public
 * Type for all the addresses stored in the Book.
 */
export type Addresses = {
  [key: string]: string;
  vmStateBuilder: string;
  redeemableERC20Factory: string;
  verifyFactory: string;
  verifyTierFactory: string;
  combineTierFactory: string;
  redeemableERC20ClaimEscrow: string;
  noticeBoard: string;
  emissionsERC20Factory: string;
  saleFactory: string;
  alwaysTier: string;
  stakeFactory: string;
  orderBook: string;
  autoApproveFactory: string;
};

const addressBook = [
  {
    /**
     * Ethereum chain
     */
    chainId: 1,
    addresses: {
      vmStateBuilder: '',
      alwaysTier: '',
      combineTierFactory: '',
      emissionsERC20Factory: '',
      noticeBoard: '',
      redeemableERC20ClaimEscrow: '',
      redeemableERC20Factory: '',
      saleFactory: '',
      verifyFactory: '',
      verifyTierFactory: '',
      stakeFactory: '',
      orderBook: '',
      autoApproveFactory: '',
    },
  },
  {
    /**
     * Goerli chain
     */
    chainId: 5,
    addresses: {
      vmStateBuilder:             '0x4658739342f31C23b15A203479DE7AB677fd7Bc6',
      alwaysTier:                 '0xAeC406C5b0B5Dc0724cA228CeeE0AD3246CCf518',
      combineTierFactory:         '0x6Db763b05C87a4a0120889C26AC778E92bd28190',
      emissionsERC20Factory:      '0xE62cF7b2B4acBE23247C49e4D5Ee39cF31C9d169',
      noticeBoard:                '0x840BcE70970f2a03eADB0be0cf4dBfef051E70A6',
      redeemableERC20ClaimEscrow: '0x54de08Bf506a7bA624BA36Ab12e393B50c652650',
      redeemableERC20Factory:     '0xBee223D3D304c5b5512F07b4047E88964493b500',
      saleFactory:                '0x21548B27a10ddE0C3a278F9545EA7D3a4EFB6696',
      verifyFactory:              '0x2386a88E4689EB60F15ce44BB0B922f70F88BdA2',
      verifyTierFactory:          '0x3E92D1002F7Da0922C2f379C1dbdb7e11Ed28B15',
      stakeFactory:               '0xD5D4373F3ac5846ACEdE555DEbD9a13D318c0678',
      orderBook:                  '0x6DE908adA18C838D5F1096E4Af4285bd9027f3fa',
      autoApproveFactory:         '0x06c8B19Db4ef47bC34373924D6f6BB05cC62861e',
    },
  },
  {
    /**
     * BNB Mainnet
     */
    chainId: 56,
    addresses: {
      vmStateBuilder: '',
      alwaysTier: '',
      combineTierFactory: '',
      emissionsERC20Factory: '',
      noticeBoard: '',
      redeemableERC20ClaimEscrow: '',
      redeemableERC20Factory: '',
      saleFactory: '',
      verifyFactory: '',
      verifyTierFactory: '',
      stakeFactory: '',
      orderBook: '',
      autoApproveFactory: '',
    },
  },
  {
    /**
     * BNB Testnet
     */
    chainId: 97,
    addresses: {
      vmStateBuilder: '',
      alwaysTier: '',
      combineTierFactory: '',
      emissionsERC20Factory: '',
      noticeBoard: '',
      redeemableERC20ClaimEscrow: '',
      redeemableERC20Factory: '',
      saleFactory: '',
      verifyFactory: '',
      verifyTierFactory: '',
      stakeFactory: '',
      orderBook: '',
      autoApproveFactory: '',
    },
  },
  {
    /**
     * Polygon chain
     */
    chainId: 137,
    addresses: {
      vmStateBuilder: '',
      alwaysTier: '',
      combineTierFactory: '',
      emissionsERC20Factory: '',
      noticeBoard: '',
      redeemableERC20ClaimEscrow: '',
      redeemableERC20Factory: '',
      saleFactory: '',
      verifyFactory: '',
      verifyTierFactory: '',
      stakeFactory: '',
      orderBook: '',
      autoApproveFactory: '',
    },
  },
  {
    /**
     * Hardhat chain
     */
    chainId: 31337,
    addresses: {
      vmStateBuilder:             '0x5FbDB2315678afecb367f032d93F642f64180aa3',
      alwaysTier:                 '0xb0279Db6a2F1E01fbC8483FCCef0Be2bC6299cC3',
      redeemableERC20Factory:     '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
      verifyFactory:              '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
      verifyTierFactory:          '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
      combineTierFactory:         '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
      redeemableERC20ClaimEscrow: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
      noticeBoard:                '0x0165878A594ca255338adfa4d48449f69242Eb8F',
      emissionsERC20Factory:      '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853',
      saleFactory:                '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6',
      stakeFactory:               '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318',
      orderBook:                  '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e',
      autoApproveFactory:         '0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82',
    },
  },
  {
    /**
     * Fuji chain - Avalanche Testnet
     */
    chainId: 43113,
    addresses: {
      vmStateBuilder: '',
      alwaysTier: '',
      combineTierFactory: '',
      emissionsERC20Factory: '',
      noticeBoard: '',
      redeemableERC20ClaimEscrow: '',
      redeemableERC20Factory: '',
      saleFactory: '',
      verifyFactory: '',
      verifyTierFactory: '',
      stakeFactory: '',
      orderBook: '',
      autoApproveFactory: '',
    },
  },
  {
    /**
     * Mumbai chain
     */
    chainId: 80001,
    addresses: {
      vmStateBuilder:             '0x20F6E357E5Ca8a5C4C7081ABc548aa5D3C1f88D5',
      alwaysTier:                 '0x1a5a119c3CD5D6118b55006DD4Aa499737B186C7',
      combineTierFactory:         '0x20e5b29B249716A5b458F334DC7F11c311E54177',
      emissionsERC20Factory:      '0x20812E2a90F3237B3EB20F53Dd7f20A60B85A032',
      noticeBoard:                '0x727bc1b817b1b41bB417af1D6b6874864C642e25',
      redeemableERC20ClaimEscrow: '0xc26f68FB5E8fcd28661A26f92587c525e54407d0',
      redeemableERC20Factory:     '0xd7FC038ae2A69AbED7cEAF50C458ec17Ec8a33bd',
      saleFactory:                '0x36D1eCa99480820FeD2a160FC98E723Eec167c0F',
      verifyFactory:              '0x2AeB6aB29AfF3901054f9364ee26916F858088Ed',
      verifyTierFactory:          '0xAf6D4770E78D2d6ad8675666E251933649A8467e',
      stakeFactory:               '0x9bf30bfd6057f411313E53104629EB754d0F54a7',
      orderBook:                  '0xb8BADe9783a815512A67B86e5fE967e9B861E102',
      autoApproveFactory: '',
    },
  },
];

const subgraphBook: SubgraphBook = {
  /**
   * Ethereum chain
   */
  1: '',
  /**
   * Goerli chain
   */
  5: 'https://api.thegraph.com/subgraphs/name/beehive-innovation/rain-protocol-goerli-v3',
  /**
   * BNB Mainnet
   */
  56: '',
  /**
   * BNB Testnet
   */
  97: '',
  /**
   * Polygon chain
   */
  137: '',
  /**
   * Hardhat chain
   */
  31337: 'https://api.url-test',
  /**
   * Fuji chain - Avalanche Testnet
   */
  43113: '',
  /**
   * Mumbai chain
   */
  80001: 'https://api.thegraph.com/subgraphs/name/beehive-innovation/rain-protocol-mumbai-v3',
};

/**
 *  @public
 * Class related to handle and obtain all the addresses and tools (like Subgraph) deployed by chain and stored in the SDK.
 *
 * @remarks
 * It will get all the addresses deployed and added at the time of the current version. If the class and methods are used directly, the chain ID should
 * be provided directly too.
 */
export class AddressBook {
  /**
   * Obtain all the addresses deployed in a specific network with a chain ID.
   *
   * @param chainId - The chain ID to get all the adddresses deployed in that network.
   * @returns All the addresses for the network provided.
   */
  public static getAddressesForChainId = (chainId: number): Addresses => {
    const network = addressBook.find((n) => n.chainId === chainId);
    if (!network?.addresses) {
      throw new Error('No deployed contracts for this chain.');
    }
    return network.addresses;
  };

  /**
   * Obtain the latest subgraph endpoint related to the version that use the SDK.
   *
   * @remarks
   * The reason of get just one endpoint by version is correctly match with the contract addresses provided by the SDK.
   *
   * You can search all the rain protocol subgraphs deployed using the search bar in https://thegraph.com/hosted-service/. Remember
   * to look by subgraph deployed by beehive-innovation or trusted deployers.
   *
   * @param chainId - The chain ID related to the Subgraph.
   * @returns The subgraph URL API endpoint.
   */
  public static getSubgraphEndpoint = (chainId: number): string => {
    const endpoint = subgraphBook[chainId];
    if (!endpoint) {
      throw new Error('No subgraph endpoint found for this chain.');
    }

    return endpoint;
  };
}