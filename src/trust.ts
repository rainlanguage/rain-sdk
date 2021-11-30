import { Token } from '@uniswap/sdk-core'
import { ethers, Signer, ContractTransaction, ContractReceipt } from 'ethers'
import { Provider } from '@ethersproject/providers'
import {
    Trust as TrustContract,
    Trust__factory,
    ReadOnlyTier,
    ReadOnlyTier__factory,
    TrustFactory__factory,
} from '@beehiveinnovation/rain-protocol/typechain'
import { Reserve } from './reserve'
import { Redeemable } from './redeemable'
import { RedeemableERC20Pool } from './redeemableERC20Pool'
import { SeedERC20 } from './seeder'
import { CRP } from './crp'
import { Pool } from './pool'
import { Config } from './types'
import { AddressBook } from './addresses'

type TrustContracts = {
    trust: TrustContract
    reserve: Reserve
    redeemable: Redeemable
    redeemableERC20Pool: RedeemableERC20Pool
    seeder: SeedERC20 | string
    tier: ReadOnlyTier | any
    crp: CRP | null
    pool: Pool | null
}

export class Trust {

    public readonly chainId: number
    public readonly readOnly: boolean
    public readonly signerOrProvider: Signer | Provider
    public reserve: Reserve
    public redeemable: Redeemable
    public redeemablePool: RedeemableERC20Pool
    public seeder: SeedERC20 | string
    public crp: CRP | null
    public pool: Pool | null

    protected constructor(contracts: TrustContracts, signerOrProvider: Signer | Provider, chainId: number) {

        this.chainId = chainId
        this.readOnly = !Signer.isSigner(signerOrProvider)
        this.signerOrProvider = signerOrProvider

        this.reserve = contracts.reserve
        this.redeemable = contracts.redeemable
        this.redeemablePool = contracts.redeemableERC20Pool
        this.seeder = contracts.seeder
        this.crp = contracts.crp
        this.pool = contracts.pool

        Object.assign(this, contracts.trust)

    }

    public static async fromAddress(address: string, signerOrProvider: Signer | Provider, chainId: number): Promise<Trust> {

        if (!ethers.utils.isAddress(address)) {
            throw "Address is not a valid address"
        }

        const trust = Trust__factory.connect(address, signerOrProvider)
        const addresses = await trust.getContracts() // @TODO change to subgraph call
        const reserve = await Reserve.fromAddress(addresses.reserveERC20, signerOrProvider, chainId)
        const redeemable = await Redeemable.fromAddress(addresses.redeemableERC20, signerOrProvider, chainId)
        const redeemableERC20Pool = await RedeemableERC20Pool.fromAddress(addresses.redeemableERC20Pool, signerOrProvider, chainId)
        const seeder = await SeedERC20.fromAddress(addresses.seeder, signerOrProvider, chainId)
        const crp = addresses.crp !== ethers.constants.AddressZero ? await CRP.fromAddress(addresses.crp, signerOrProvider, chainId) : null
        const pool = addresses.pool !== ethers.constants.AddressZero ? await Pool.fromAddress(addresses.pool, signerOrProvider, chainId) : null

        const tier = ReadOnlyTier__factory.connect(addresses.tier, signerOrProvider)

        return new Trust({
            trust,
            reserve,
            redeemable,
            redeemableERC20Pool,
            seeder,
            tier,
            crp,
            pool
        }, signerOrProvider, chainId)
    }

    public static async fromTransactionReceipt(receipt: ContractReceipt, signerOrProvider: Signer | Provider, chainId: number): Promise<Trust> {
        const trustAddress = receipt.events?.filter(
            (x) => x.event == "NewContract"
        )[0].topics[1]

        if (trustAddress == undefined) {
            throw ('Event "NewContract" is not in transaction receipt.')
        }

        return this.fromAddress(trustAddress, signerOrProvider, chainId)
    }

    public static async createTrust(config: Config, signer: Signer, chainId: number): Promise<ContractTransaction> {
        const trustFactory = TrustFactory__factory.connect(AddressBook.getFactoryAddressFromChainId(chainId), signer)
        const tx = await trustFactory['createChild((address,uint256,address,uint256,uint16,uint16,uint256),(string,string,address,uint8,uint256),(address,uint256,uint256,uint256,uint256))'](config.trustConfig, config.redeemableERC20Config, config.redeemableERC20PoolConfig)
        return tx;
    }

    /**
     * Helper method for returning both tokens.
     */
    public async tokens(): Promise<[Token, Token]> {
        return [await this.reserve.getToken(), await this.redeemable.getToken()]
    }
}


