import React from "react";
import ReactDOM from "react-dom/client";

import { WagmiConfig, createClient, configureChains, chain } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";

const { chains, provider, webSocketProvider } = configureChains(
  [chain.goerli, chain.polygonMumbai],
  [
    // alchemyProvider({ apiKey: "k5Xr7DanRifL-_q2Hmu7D8t1Mfl-frpA" }), // Mumbai
    alchemyProvider({ apiKey: "4gLaQuAql7LRk68ydUJN_csGpw8C9Zim" }), // Goerli
    publicProvider(),
  ]
);

const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "wagmi",
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: "Injected",
        shimDisconnect: true,
      },
    }),
  ],
  provider,
  webSocketProvider,
});

import { createHashRouter, RouterProvider } from "react-router-dom";

import ErrorPage from "./error-page";

import Index from "./routes/index";
import Layout from "./routes/layout";

import GetSellers from "./routes/seller/GetSellers";
import GetSeller from "./routes/seller/GetSeller";
import AddSeller from "./routes/seller/AddSeller";
import AddDelivery from "./routes/delivery/AddDelivery";

const qaravan = createHashRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: <Index />,
          },
          {
            path: "sellers",
            element: <GetSellers />,
          },
          {
            path: "sellers/:seller/:erc1155",
            element: <GetSeller />,
          },
          {
            path: "sellers/add",
            element: <AddSeller />,
          },
          {
            path: "delivery/add",
            element: <AddDelivery />,
          },
          {
            path: "orders",
            element: <GetOrders />,
          },
        ],
      },
    ],
  },
]);

import { MantineProvider, MantineThemeOverride } from "@mantine/core";
import GetOrders from "./routes/order/GetOrders";

const myTheme: MantineThemeOverride = {
  colorScheme: "dark",
  fontFamily: "Dosis, sans-serif",
  fontFamilyMonospace: "Dosis, monospace",
  headings: { fontFamily: "Dosis, sans-serif" },
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider withGlobalStyles withNormalizeCSS theme={myTheme}>
      <WagmiConfig client={client}>
        <RouterProvider router={qaravan} />
      </WagmiConfig>
    </MantineProvider>
  </React.StrictMode>
);
