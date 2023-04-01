import { useMemo } from "react";
import { useBlockchainData } from "../context/BlockchainDataProvider";

const useDemoMode = () => {
  const { blockchainState } = useBlockchainData();
  const { account } = blockchainState;

  const isDemoWallet = useMemo(() => {
    const demoWallets = [
      "0x167813E0D6958BCF30a1cEbEE53aE0C57677c963", // Alex
      "0x374E4F9EF906F3e51df1b3305936Ec18A6797748", // Rafi
      "0x1d2CBA07B5EFE517586F0453303B5CAFa904e5ca",
      "0x91663f613945C9F90CC2b74328Db44441D993172", // MB
    ];
    return demoWallets.includes(account);
  }, [account]);

  return isDemoWallet;
};

export default useDemoMode;