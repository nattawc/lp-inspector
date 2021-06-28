import React, { useEffect, useState } from "react";
import "./styles/App.css";
import "./styles/constants.css";
import { Web3ReactProvider } from "@web3-react/core";
import AddressInput from "./components/AddressInput";
import ConnectWallet from "./components/ConnectWallet";
import BalanceDetails from "./components/BalanceDetails";

import Footer from "./components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearchDollar } from "@fortawesome/free-solid-svg-icons";
import Web3 from "web3";
import {
  FC_MC,
  FC_ROUTER,
  GOONG_MC,
  RBH_MC,
  masterChefPresets,
  PANCAKE_ROUTER,
  routerPresets,
} from "./utils/constants";

function getLibrary(provider: any, connector?: any) {
  return new Web3(provider); // this will vary according to whether you use e.g. ethers or web3.js
}

const wa: any = window;

function App() {
  const [isManual, setIsManual] = useState<boolean>(false);
  const [contractAddress, setContractAddress] = useState("");
  const [routercontractAddress, setRouterContractAddress] =
    useState(PANCAKE_ROUTER);
  const [address, setAddress] = useState<string>(
    wa.web3 ? "" : localStorage.getItem("address") || ""
  );
  const [showDetails, setShowDetails] = useState<boolean>(false);

  useEffect(() => {
    setShowDetails(contractAddress !== "" && routercontractAddress !== "");

    return () => {
      setShowDetails(false);
    };
  }, [routercontractAddress, contractAddress, showDetails]);

  function updateWalletAddress(_address: string) {
    setAddress(_address);
    localStorage.setItem("address", _address);
  }
  function presetSelect(_m: string, _r: string) {
    setIsManual(false);
    setShowDetails(false);
    setContractAddress(_m);
    setRouterContractAddress(_r);
  }
  function resetSelect() {
    setIsManual(true);
    setShowDetails(false);
    setContractAddress("");
  }
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <div className="app-container">
        <div className="app-content-container">
          <div className="app-header">
            <div className="app-header-left">
              <FontAwesomeIcon icon={faSearchDollar} className="app-icon" />
              <h1>How much is my LP worth?</h1>
            </div>
            {wa.web3 && (
              <ConnectWallet callback={setAddress}>Connect</ConnectWallet>
            )}
          </div>
          <hr />

          {address || !wa.web3 ? (
            <>
              {!wa.web3 && (
                <AddressInput
                  placeholder="Enter your address"
                  label="Your address"
                  defaultValue={address}
                  callback={updateWalletAddress}
                />
              )}
              <label className="address-input-label">Preset Selector</label>
              <div className="d-flex">
                <input
                  type="radio"
                  name="preset"
                  onClick={() => {
                    presetSelect(FC_MC, FC_ROUTER);
                  }}
                />{" "}
                Foodcourt (COUPON){" "}
                <a target="_blank" href="https://foodcourt.finance">
                  &rarr;
                </a>
              </div>
              <div className="d-flex">
                <input
                  type="radio"
                  name="preset"
                  onClick={() => {
                    presetSelect(GOONG_MC, PANCAKE_ROUTER);
                  }}
                />{" "}
                Tomyumgoong (GOONG){" "}
                <a target="_blank" href="https://tomyumgoong.finance">
                  &rarr;
                </a>
              </div>{" "}
              <div className="d-flex">
                <input
                  type="radio"
                  name="preset"
                  onClick={() => {
                    presetSelect(RBH_MC, PANCAKE_ROUTER);
                  }}
                />{" "}
                RobinhoodSwap (RBH){" "}
                <a target="_blank" href="https://robinhoodswap.finance">
                  &rarr;
                </a>
              </div>{" "}
              <div className="d-flex">
                <input
                  type="radio"
                  name="preset"
                  onClick={() => {
                    resetSelect();
                  }}
                />{" "}
                Other ... (Manual Select)
              </div>
              <br />
              {isManual && (
                <>
                  <AddressInput
                    placeholder="Enter Masterchef address"
                    label="MasterChef address"
                    presets={masterChefPresets}
                    callback={setContractAddress}
                  />
                  <AddressInput
                    placeholder="Enter Router address"
                    label="Router address (default to Pancakeswap)"
                    defaultValue={routercontractAddress}
                    presets={routerPresets}
                    callback={setRouterContractAddress}
                  />
                </>
              )}
              <div className="app-details-section">
                {showDetails ? (
                  <BalanceDetails
                    address={address}
                    contractAddress={contractAddress}
                    routerContractAddress={routercontractAddress}
                  />
                ) : (
                  <p>Fill contract addresses above to see details here.</p>
                )}
              </div>
            </>
          ) : (
            <p className="app-connect-wallet-first">
              Connect wallet to use the app.
            </p>
          )}
          <Footer showDonate={address !== ""} />
        </div>
      </div>
    </Web3ReactProvider>
  );
}

export default App;
