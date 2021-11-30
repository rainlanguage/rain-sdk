import { SeedERC20__factory } from '@beehiveinnovation/rain-protocol/typechain';
import { Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';

export async function isSeederERC20(
  address: string,
  signerOrProvider: Signer | Provider
): Promise<boolean> {
  const seeder = SeedERC20__factory.connect(address, signerOrProvider);

  let isSeeder = false;
  // try calling one of its methods first, if it fails it isn't a SeedERC20
  seeder
    .seedPrice()
    .then(async () => {
      isSeeder = true;
    })
    .catch(() => {
      isSeeder = false;
    });

  return isSeeder;
}
