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
    /**
     * Ethereum chain
     */
    chainId: 1,
    addresses: {
      vmStateBuilder: "",
      alwaysTier: '0x735ECdF9a79e62531BAB9240696a450F94AB79f8',
      combineTierFactory: '0x36983711f9C4869F0B9BEb2Cf677814bb40d41c5',
      erc20BalanceTierFactory: '0x50B2921A8c915A8228dA39e93AD9E9AA43fBc901',
      erc20TransferTierFactory: '0xB681C35244a224Fcf8c4eeC0b139980705EdF4fE',
      erc721BalanceTierFactory: '0x4Dd6BF4a433265D6B01Ae18E77Ef069Cb29a0790',
      emissionsERC20Factory: '0xe7CE1aF1e174f1526EE3f10C0cb0E01E0e47FD4E',
      gatedNFTFactory: '0x53f9810AF32AC48b04DEbc6e8f32fC245eB88cE5',
      noticeBoard: '0x1C432FBb8cd10749F3A93a91AE01f1d08FA7569a',
      redeemableERC20ClaimEscrow: '0x10DB4a5BB73150B1CEF945e90E4336b594D64DFb',
      redeemableERC20Factory: '0xD2c0729dc1A7BbeF0a770bA7F9f2DbAE9A9e27D0',
      saleFactory: '0x4dce23a63ec3f27193df8ba26141b25417815c62',
      verifyFactory: '0x039Ab991616b3B473f3096D385b6660c846F646A',
      verifyTierFactory: '0x4B2C45c3F393B803C57106C81e4E64Ce71914b8e',
    },
  },
  {
    /**
     * Goerli chain
     */
    chainId: 5,
    addresses: {
      vmStateBuilder: "",
      alwaysTier: '0x1Fcf1f92919F0E0023463234c78296E9517b56Ea',
      combineTierFactory: '0x34A0946CEAD3417E629B2679D05C0A24d49a1eB4',
      erc20BalanceTierFactory: '0xbA9Ce92a65e172ADd70A71B6E280D9941fb9185C',
      erc20TransferTierFactory: '0xcF75a4bc22AD40D6DA6f57b5174D39D28bC85a96',
      erc721BalanceTierFactory: '0xa76F06F09346141977cF652A1EDFD09D779AA22a',
      emissionsERC20Factory: '0x586Fa008Ae3C1228B9E42452DfE04c99D7E97C35',
      gatedNFTFactory: '0xE09f5c0bA8A3C59f3c7aFFB458058881413878a2',
      noticeBoard: '0x25ACA096cbEF597Aa3B99CDD747805e58d1aea81',
      redeemableERC20ClaimEscrow: '0x00DDE5505E0075C4bF7536d3d2014895D9cbE546',
      redeemableERC20Factory: '0x16D33236D7Af17ca55E60EcE64e9F6CeD32Ba416',
      saleFactory: '0xA54f23A7B650Ea510fCA651EAfc39BFA5a04010D',
      verifyFactory: '0xa018eAB945De7e8073d1995284b78FC0cfE45B76',
      verifyTierFactory: '0x333F9355Bc47A22f64ac5C5F3d7cC5408544851f',
    },
  },
  {
    /**
     * BNB Mainnet
     */
    chainId: 56,
    addresses: {
      vmStateBuilder: "",
      alwaysTier: '0x735ECdF9a79e62531BAB9240696a450F94AB79f8',
      combineTierFactory: '0x36983711f9C4869F0B9BEb2Cf677814bb40d41c5',
      erc20BalanceTierFactory: '0x50B2921A8c915A8228dA39e93AD9E9AA43fBc901',
      erc20TransferTierFactory: '0xB681C35244a224Fcf8c4eeC0b139980705EdF4fE',
      erc721BalanceTierFactory: '0x4Dd6BF4a433265D6B01Ae18E77Ef069Cb29a0790',
      emissionsERC20Factory: '0xe7CE1aF1e174f1526EE3f10C0cb0E01E0e47FD4E',
      gatedNFTFactory: '0x53f9810AF32AC48b04DEbc6e8f32fC245eB88cE5',
      noticeBoard: '0x1C432FBb8cd10749F3A93a91AE01f1d08FA7569a',
      redeemableERC20ClaimEscrow: '0x10db4a5bb73150b1cef945e90e4336b594d64dfb',
      redeemableERC20Factory: '0xD2c0729dc1A7BbeF0a770bA7F9f2DbAE9A9e27D0',
      saleFactory: '0x4dce23A63ec3f27193Df8bA26141b25417815C62',
      verifyFactory: '0x039Ab991616b3B473f3096D385b6660c846F646A',
      verifyTierFactory: '0x4B2C45c3F393B803C57106C81e4E64Ce71914b8e',
    },
  },
  {
    /**
     * BNB Testnet
     */
    chainId: 97,
    addresses: {
      vmStateBuilder: "",
      alwaysTier: '0x735ECdF9a79e62531BAB9240696a450F94AB79f8',
      combineTierFactory: '0x36983711f9C4869F0B9BEb2Cf677814bb40d41c5',
      erc20BalanceTierFactory: '0x50B2921A8c915A8228dA39e93AD9E9AA43fBc901',
      erc20TransferTierFactory: '0xB681C35244a224Fcf8c4eeC0b139980705EdF4fE',
      erc721BalanceTierFactory: '0x4Dd6BF4a433265D6B01Ae18E77Ef069Cb29a0790',
      emissionsERC20Factory: '0xe7CE1aF1e174f1526EE3f10C0cb0E01E0e47FD4E',
      gatedNFTFactory: '0x53f9810AF32AC48b04DEbc6e8f32fC245eB88cE5',
      noticeBoard: '0x1C432FBb8cd10749F3A93a91AE01f1d08FA7569a',
      redeemableERC20ClaimEscrow: '0x10DB4a5BB73150B1CEF945e90E4336b594D64DFb',
      redeemableERC20Factory: '0xD2c0729dc1A7BbeF0a770bA7F9f2DbAE9A9e27D0',
      saleFactory: '0x4dce23A63ec3f27193Df8bA26141b25417815C62',
      verifyFactory: '0x039Ab991616b3B473f3096D385b6660c846F646A',
      verifyTierFactory: '0x4B2C45c3F393B803C57106C81e4E64Ce71914b8e',
    },
  },
  {
    /**
     * Polygon chain
     */
    chainId: 137,
    addresses: {
      vmStateBuilder: "",
      alwaysTier: '0xF81572101B3bD379ADFddCBF4d46f40268475A14',
      combineTierFactory: '0xaB9D00F59A8C45b8b20F060D5F7d97FdDbA2De19',
      erc20BalanceTierFactory: '0xcCFa697D85771B67826cB7E1F7535576fA91b6b1',
      erc20TransferTierFactory: '0x807FBB1515fcFD5574b8d5FfA6e4b831d7897987',
      erc721BalanceTierFactory: '0x095Cc7BcA08F2A9c1059DE30631aA94fF9fca623',
      emissionsERC20Factory: '0xED4f245C7Afc8b52295d4045929bbdd6ba722Eaa',
      gatedNFTFactory: '0x1965F5943F8a6C18C444fad09094aB6cFfBe3F4a',
      noticeBoard: '0x790Bfb7C3E07805F9880ece979ee2f3E19f524C2',
      redeemableERC20ClaimEscrow: '0x588BFaF31410240A1A780dbd7078485A7A65305A',
      redeemableERC20Factory: '0x84A35D90D5181473662e67eFE6e2de350F9918d7',
      saleFactory: '0x6ab3Dde1e33F64F294a8b55321d345724C85E0A4',
      verifyFactory: '0xe68B2ce23d959bEe80d92b25271B767AE7A6A79D',
      verifyTierFactory: '0xB827ae1cD6D27abd56070d196A7175E02e531A5d',
    },
  },
  {
    /**
     * Hardhat chain
     */
    chainId: 31337,
    addresses: {
      vmStateBuilder: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      alwaysTier: '0xBA12646CC07ADBe43F8bD25D83FB628D29C8A762',
      redeemableERC20Factory: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
      verifyFactory: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
      verifyTierFactory: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
      erc20BalanceTierFactory: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
      erc20TransferTierFactory: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
      combineTierFactory: '0x0165878A594ca255338adfa4d48449f69242Eb8F',
      erc721BalanceTierFactory: '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853',
      gatedNFTFactory: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6',
      redeemableERC20ClaimEscrow: '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318',
      noticeBoard: '0x610178dA211FEF7D417bC0e6FeD39F05609AD788',
      emissionsERC20Factory: '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e',
      saleFactory: '0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0',
    },
  },
  {
    /**
     * Fuji chain - Avalanche Testnet
     */
    chainId: 43113,
    addresses: {
      vmStateBuilder: "",
      alwaysTier: '0x3f16F26C6844be3d0934EC0543039d874D45da9e',
      combineTierFactory: '0x4B8FC6f1f3f62099f4fb7151548b9c5226ceD76E',
      erc20BalanceTierFactory: '0x724007CDD1689e43c6ef55b7032b93A1cC8C02C7',
      erc20TransferTierFactory: '0xB28A191150D901cCFF849983E714d689Eb25e7eC',
      erc721BalanceTierFactory: '0xFC870c970b34926ecf224e981caCdF21e963a084',
      emissionsERC20Factory: '0x060974dd46c2dbB22Aa7a7AFE685880A4A7B34d2',
      gatedNFTFactory: '0x1dBB0186c4805238FcA1c94e38479D3a5546722D',
      noticeBoard: '0xCD2A879a770Df2Bbcc0f7496AA5105a4068Aa1e6',
      redeemableERC20ClaimEscrow: '0x8a9B7B490Feb339640dA303c3602B6786061Da30',
      redeemableERC20Factory: '0xff56cc9B3aC11Dbe1620865DC29FA2CcC4213C28',
      saleFactory: '0x4E1742656F066470cbd68B50864E168D8054E90d',
      verifyFactory: '0xBd9C59Cf73C0446341E8b1B532E9534A1E36501C',
      verifyTierFactory: '0x2a72d7fcDD6C4640EF612a6523217Df67d34cf4b',
    },
  },
  {
    /**
     * Mumbai chain
     */
    chainId: 80001,
    addresses: {
      vmStateBuilder: "",
      alwaysTier: '0x051dC03ba4d33eCC59Fb23F506Fe1e67004F142C',
      combineTierFactory: '0x21fC48631F0efA5EFe790b5c05929cEdc271dB43',
      erc20BalanceTierFactory: '0xb1C8EA6E410a71290D5C21404D3324e61912e3c6',
      erc20TransferTierFactory: '0x2f1554BF57a234828ca3D210bA65cF80d8e5073c',
      erc721BalanceTierFactory: '0xC0E50AD884EBb7C2582677978d48338D46930a08',
      emissionsERC20Factory: '0xE51BeE9adccBafc20507e01EAA4F5aA966306669',
      gatedNFTFactory: '0xbfe6E65daB36FbdB14bC7979D5DE244628F4eD3a',
      noticeBoard: '0x4B02C8ceF32db81D4918e1C5b4b16EBA6830872a',
      redeemableERC20ClaimEscrow: '0xCd67b4ef5659B776e996Dd4Be371DCac4ABba6c8',
      redeemableERC20Factory: '0x4127ea3daf008043a3783094064670d1330d53f0',
      saleFactory: '0xE152e59e644e49AE5D73Df70658084DFc8b5CBb6',
      verifyFactory: '0x6e55b00ecfc718d202e57709a747fe3fc7f6e61e',
      verifyTierFactory: '0x2aAA6104B099B2d1DF1D984F67da042555506B71',
    },
  },
];

const subgraphBook: SubgraphBook = {
  /**
   * Ethereum chain
   */
  1: 'https://api.thegraph.com/subgraphs/name/beehive-innovation/rain-protocol-mainnet-e590ce',
  /**
   * Goerli chain
   */
  5: 'https://api.thegraph.com/subgraphs/name/beehive-innovation/rain-protocol-goerli-e590ce',
  /**
   * BNB Mainnet
   */
  56: 'https://api.thegraph.com/subgraphs/name/beehive-innovation/rain-protocol-bnb-e590ce',
  /**
   * BNB Testnet
   */
  97: 'https://api.thegraph.com/subgraphs/name/beehive-innovation/rain-protocol-bnb-chapel-e590ce',
  /**
   * Polygon chain
   */
  137: 'https://api.thegraph.com/subgraphs/name/beehive-innovation/rain-protocol-polygon-e590ce',
  /**
   * Hardhat chain
   */
  31337: 'https://api.url-test',
  /**
   * Fuji chain - Avalanche Testnet
   */
  43113:
    'https://api.thegraph.com/subgraphs/name/nanezx/rain-protocol-fuji-e590ce',
  /**
   * Mumbai chain
   */
  80001:
    'https://api.thegraph.com/subgraphs/name/beehive-innovation/rain-protocol-mumbai-e590ce',
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
