import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { PoolTogetherAirdropTokenBalancesHelper } from '../helpers/pool-together.airdrop.balance-helper';
import { PoolTogetherClaimableTokenBalancesHelper } from '../helpers/pool-together.claimable.balance-helper';
import { POOL_TOGETHER_DEFINITION } from '../pool-together.definition';

@Register.BalanceFetcher(POOL_TOGETHER_DEFINITION.id, Network.AVALANCHE_MAINNET)
export class AvalanchePoolTogetherBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PoolTogetherClaimableTokenBalancesHelper)
    private readonly claimableTokenBalancesHelper: PoolTogetherClaimableTokenBalancesHelper,
    @Inject(PoolTogetherAirdropTokenBalancesHelper)
    private readonly airdropTokenBalancesHelper: PoolTogetherAirdropTokenBalancesHelper,
  ) {}

  async getV4TokenBalance(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      network: Network.AVALANCHE_MAINNET,
      appId: POOL_TOGETHER_DEFINITION.id,
      groupId: POOL_TOGETHER_DEFINITION.groups.vault.id,
      address,
    });
  }

  async getPrizeTicketTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      network: Network.AVALANCHE_MAINNET,
      appId: POOL_TOGETHER_DEFINITION.id,
      groupId: POOL_TOGETHER_DEFINITION.groups.prizeTicket.id,
      address,
    });
  }

  async getPodTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      network: Network.AVALANCHE_MAINNET,
      appId: POOL_TOGETHER_DEFINITION.id,
      groupId: POOL_TOGETHER_DEFINITION.groups.pod.id,
      address,
    });
  }

  async getClaimableBalances(address: string) {
    return this.claimableTokenBalancesHelper.getBalances({
      address,
      network: Network.AVALANCHE_MAINNET,
    });
  }

  async getAirdropBalances(address: string) {
    return this.airdropTokenBalancesHelper.getBalances({
      address,
      network: Network.AVALANCHE_MAINNET,
    });
  }

  async getBalances(address: string) {
    const [v4TokenBalance] = await Promise.all([this.getV4TokenBalance(address)]);

    return presentBalanceFetcherResponse([
      {
        label: 'PoolTogether',
        assets: v4TokenBalance,
      },
    ]);
  }
}
