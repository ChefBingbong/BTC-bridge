import { GeistSans } from "geist/font/sans";
import type { AppType } from "next/app";

import { Providers } from "~/Providers";
import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <main className={GeistSans.className}>
      <Providers>
        <Component {...pageProps} />
      </Providers>
    </main>
  );
};

export default MyApp;
