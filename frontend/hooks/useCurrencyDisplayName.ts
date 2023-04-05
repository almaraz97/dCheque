import { useCallback } from "react";
import { CheqCurrency } from "../components/designSystem/CurrencyIcon";
import { useBlockchainData } from "../context/BlockchainDataProvider";
import { deployedChains } from "../context/chainInfo";

export const useCurrencyDisplayName = () => {
  const { blockchainState } = useBlockchainData();

  const displayNameForCurrency = useCallback(
    (currency: CheqCurrency, sourceChainId?: string) => {
      if (sourceChainId) {
        return deployedChains[sourceChainId].nativeCurrency.symbol;
      }
      deployedChains;
      if (currency === "NATIVE") {
        return blockchainState.nativeCurrenySymbol;
      }
      return currency;
    },
    [blockchainState.nativeCurrenySymbol]
  );

  return { displayNameForCurrency };
};
