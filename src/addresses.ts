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
  redeemableERC20Factory: string;
  verifyFactory: string;
  verifyTierFactory: string;
  erc20BalanceTierFactory: string;
  erc20TransferTierFactory: string;
  combineTierFactory: string;
  erc721BalanceTierFactory: string;
  gatedNFTFactory: string;
  redeemableERC20ClaimEscrow: string;
  noticeBoard: string;
  emissionsERC20Factory: string;
  saleFactory: string;
  alwaysTier: string;
};

const addressBook = [
  {
    chainId: 80001,
    addresses: {
      alwaysTier: '0xCA1666Fecc36b016578796F658A0889Bce796582',
      combineTierFactory: '0xf163E422eaa4e7b38b392a0Ab663d92c17cEC364',
      erc20BalanceTierFactory: '0xe662E03b0039d5B82DA705B0c15BE581900EE6bE',
      erc20TransferTierFactory: '0x56c338900BC7BC43CaE1De519B63D075075Fbd5F',
      erc721BalanceTierFactory: '0x119ec54eFDf4acbc0e5fa920a5eaA28D5F6695b1',
      emissionsERC20Factory: '0x859D847B9E7B94c74A128cA9E23C96C98cb34Aa8',
      gatedNFTFactory: '0xB4a49642F1bA29c2e812975708FB3BC43242A31f',
      noticeBoard: '0x5d6bBefbA77A20e84b447e0c567A27a71270dd78',
      redeemableERC20ClaimEscrow: '0x7B9a17983De09e97039868692531aD669Ba3238c',
      redeemableERC20Factory: '0xb41c9f5f71ED81406A16C03676bAd5BCBB75B661',
      saleFactory: '0x272a42AcfdDb7d88d65aeC2e462d5dFC764A25e6',
      verifyFactory: '0x42Bfc1742A20005D7E8b6Bf085B8877fC96C61ae',
      verifyTierFactory: '0xd56A49817C6C50B420F1AC75049E710456b0A9D6',
    },
  },
  {
    // These addresess are deployed in HH Network (test)
    chainId: 31337,
    addresses: {
      alwaysTier: '0x23dB4a08f2272df049a4932a4Cc3A6Dc1002B33E',
      redeemableERC20Factory: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
      verifyFactory: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
      verifyTierFactory: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
      erc20BalanceTierFactory: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
      erc20TransferTierFactory: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
      combineTierFactory: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
      erc721BalanceTierFactory: '0x0165878A594ca255338adfa4d48449f69242Eb8F',
      gatedNFTFactory: '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853',
      redeemableERC20ClaimEscrow: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6',
      noticeBoard: '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318',
      emissionsERC20Factory: '0x610178dA211FEF7D417bC0e6FeD39F05609AD788',
      saleFactory: '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e',
    },
  },
];

const subgraphBook: SubgraphBook = {
  31337: 'https://api.url-test',
  80001:
    'https://api.thegraph.com/subgraphs/name/nanezx/rain-protocol-v2_2-mumbai',
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
