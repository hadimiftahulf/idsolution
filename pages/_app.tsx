import { AppProps } from "next/app";
import "../styles/global-styles.css";
import "../styles/custom-styles.css";
import UIkit from "uikit";
import Icons from "uikit/dist/js/uikit-icons";
import { SessionProvider } from "next-auth/react";
import { ReactElement, ReactNode } from "react";
import { NextPage } from "next";
// import Layout from "@/components/layout";
import dynamic from "next/dynamic";
const Layout = dynamic(() => import("@/components/layout"), { ssr: false });

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};
const App = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  UIkit.use(Icons);

  return (
    <SessionProvider session={session}>
      {Component.getLayout ? (
        <Component {...pageProps} />
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </SessionProvider>
  );
};

export default App;
