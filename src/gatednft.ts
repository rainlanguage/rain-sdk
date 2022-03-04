import { GatedNFT__factory, GatedNFT as GatedNFTContract, GatedNFTFactory__factory, GatedNFTFactory as GatedNFTFactoryContract } from '@beehiveinnovation/rain-statusfi/typechain'
import { BigNumberish, ContractReceipt, Signer } from 'ethers'
import { AddressBook } from '.'
import { ConfigStruct } from '@beehiveinnovation/rain-statusfi/typechain/GatedNFTFactory'
import { getNewChildFromReceipt } from './utils'

export class GatedNFT {
    public readonly chainId: number
    public readonly signer: Signer
    public readonly gatedNFTFactory: GatedNFTFactoryContract
    public readonly gatedNFT: GatedNFTFactoryContract

    constructor(signer: Signer, chainId: number) {
        this.chainId = chainId
        this.signer = signer
        const address = AddressBook.getAddressesForChainId(chainId).gatedNFT
        this.gatedNFTFactory = GatedNFTFactory__factory.connect(address, signer)
    }

    public async createChild(
        config_: ConfigStruct,
        tier_: string,
        minimumStatus_: BigNumberish,
        maxPerAddress_: BigNumberish,
        transferrable_: BigNumberish,
        maxMintable_: BigNumberish,
        royaltyRecipient_: string,
        royaltyBPS: BigNumberish
    ) {
        return this.gatedNFTFactory.createChildTyped(
            config_,
            tier_,
            minimumStatus_,
            maxPerAddress_,
            transferrable_,
            maxMintable_,
            royaltyRecipient_,
            royaltyBPS
        )
    }

    public getNewChildFromReceipt(receipt: ContractReceipt): GatedNFTContract {
        const childAddress = getNewChildFromReceipt(receipt, this.gatedNFTFactory)
        return GatedNFT__factory.connect(childAddress, this.signer)
    }
} 