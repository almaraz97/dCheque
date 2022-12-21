import React, {
  createContext,
  memo,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useContext } from "react";
import { BigNumber, ethers } from "ethers";
import SelfSignedBroker from "../out/CheqV2.sol/SelfSignTimeLock.json";
import erc20 from "../out/ERC20.sol/TestERC20.json";
import Web3Modal from "web3modal";
import { providerOptions } from "./providerOptions";
import { mappingForChainId } from "./chainInfo";
import { useColorMode } from "@chakra-ui/react";

export const APIURL = "http://localhost:8000/subgraphs/name/CheqV2/CRX";

interface BlockchainDataInterface {
  account: string;
  userType: string;
  dai: null | ethers.Contract;
  weth: null | ethers.Contract;
  selfSignBroker: null | ethers.Contract;
  daiAllowance: BigNumber;
  wethAllowance: BigNumber;
  cheqAddress: string;
  userDaiBalance: string;
  userWethBalance: string;

  signer: null | ethers.providers.JsonRpcSigner;
}

interface BlockchainDataContextInterface {
  blockchainState: BlockchainDataInterface;
  isInitializing: boolean;
  connectWallet?: () => Promise<void>;
}

const defaultBlockchainState = {
  account: "",
  userType: "Customer",
  cheq: null,
  dai: null,
  weth: null,
  selfSignBroker: null,
  daiAllowance: BigNumber.from(0),
  wethAllowance: BigNumber.from(0),
  cheqAddress: "",
  qDAI: "",
  qWETH: "",
  userDaiBalance: "",
  userWethBalance: "",
  cheqTotalSupply: "",
  signer: null,
};

const BlockchainDataContext = createContext<BlockchainDataContextInterface>({
  blockchainState: defaultBlockchainState,
  isInitializing: true,
});

export const BlockchainDataProvider = memo(
  ({ children }: { children: React.ReactNode }) => {
    const [blockchainState, setBlockchainState] =
      useState<BlockchainDataInterface>(defaultBlockchainState);

    const [isInitializing, setIsInitializing] = useState(true);

    const { colorMode } = useColorMode();

    const connectWalletWeb3Modal = useCallback(async () => {
      const web3Modal = new Web3Modal({
        cacheProvider: true, // optional
        providerOptions, // required
        theme: colorMode,
      });
      const web3ModalConnection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(web3ModalConnection);
      const signer = provider.getSigner(); //console.log(provider)
      const account = await signer.getAddress(); //console.log(account)
      return [provider, signer, account] as [
        ethers.providers.Web3Provider,
        ethers.providers.JsonRpcSigner,
        string
      ];
    }, [colorMode]);

    const loadBlockchainData = useCallback(async () => {
      setIsInitializing(true);
      try {
        const [provider, signer, account] = await connectWalletWeb3Modal(); // console.log(provider, signer, account)
        const userType =
          account == "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
            ? "Customer"
            : account == "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
            ? "Merchant"
            : "Auditor";
        const { chainId } = await provider.getNetwork();
        const mapping = mappingForChainId(chainId);

        // Load contracts
        const selfSignBroker = new ethers.Contract(
          mapping.selfSignedBroker,
          SelfSignedBroker.abi,
          signer
        );
        const weth = new ethers.Contract(mapping.weth, erc20.abi, signer);
        const dai = new ethers.Contract(mapping.dai, erc20.abi, signer);

        const userDaiBalance = await dai.balanceOf(account); // User's Dai balance
        const daiAllowance = await dai.allowance(account, mapping.cheq);

        const userWethBalance = await weth.balanceOf(account); // User's Weth balance
        const wethAllowance = await weth.allowance(account, mapping.cheq);

        setBlockchainState({
          signer,
          account,
          userType,
          dai,
          weth,
          selfSignBroker,
          daiAllowance,
          wethAllowance,
          cheqAddress: mapping.crx,
          userDaiBalance: ethers.utils.formatUnits(userDaiBalance),
          userWethBalance: ethers.utils.formatUnits(userWethBalance),
        });
        setIsInitializing(false);
      } catch (e) {
        console.log("error", e);
        window.alert("Contracts not deployed to the current network");
        setIsInitializing(false);
      }
    }, [connectWalletWeb3Modal]);

    useEffect(() => {
      const web3Modal = new Web3Modal({
        cacheProvider: true, // optional
        providerOptions, // required
      });
      if (web3Modal.cachedProvider) {
        loadBlockchainData();
      } else {
        setIsInitializing(false);
      }
    }, []);

    return (
      <BlockchainDataContext.Provider
        value={{
          blockchainState,
          connectWallet: loadBlockchainData,
          isInitializing,
        }}
      >
        {children}
      </BlockchainDataContext.Provider>
    );
  }
);

export function useBlockchainData() {
  return useContext(BlockchainDataContext);
}
