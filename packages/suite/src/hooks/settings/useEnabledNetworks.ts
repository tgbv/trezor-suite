import { useSelector, useActions } from 'src/hooks/suite';
import { changeCoinVisibility } from 'src/actions/settings/walletSettingsActions';
import type { Network } from 'src/types/wallet';

import { getMainnets, getTestnets } from '@suite-common/wallet-config';

type EnabledNetworks = {
    mainnets: Network[];
    testnets: Network[];
    enabledNetworks: Network['symbol'][];
    setEnabled: (symbol: Network['symbol'], enabled: boolean) => void;
};

export const useEnabledNetworks = (): EnabledNetworks => {
    const enabledNetworks = useSelector(state => state.wallet.settings.enabledNetworks);
    const isDebug = useSelector(state => state.suite.settings.debug.showDebugMenu);

    const mainnets = getMainnets();

    const testnets = getTestnets(isDebug);

    const { setEnabled } = useActions({
        setEnabled: changeCoinVisibility,
    });

    return {
        mainnets,
        testnets,
        enabledNetworks,
        setEnabled,
    };
};
