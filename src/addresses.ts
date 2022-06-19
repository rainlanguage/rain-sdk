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
    },
  },
  {
    /**
     * Goerli chain
     */
    chainId: 5,
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
    },
  },
  {
    /**
     * Hardhat chain
     */
    chainId: 31337,
    addresses: {
      vmStateBuilder: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
      alwaysTier: '0xBA12646CC07ADBe43F8bD25D83FB628D29C8A762',
      redeemableERC20Factory: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
      verifyFactory: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
      verifyTierFactory: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
      combineTierFactory: '0x0165878A594ca255338adfa4d48449f69242Eb8F',
      redeemableERC20ClaimEscrow: '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318',
      noticeBoard: '0x610178dA211FEF7D417bC0e6FeD39F05609AD788',
      emissionsERC20Factory: '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e',
      saleFactory: '0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0',
      stakeFactory: '',
      orderBook: '',
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
    },
  },
  {
    /**
     * Mumbai chain
     */
    chainId: 80001,
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
  5: '',
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
  80001: '',
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
