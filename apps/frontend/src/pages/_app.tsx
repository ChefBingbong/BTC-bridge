import { GeistSans } from "geist/font/sans";
import type { AppProps, AppType } from "next/app";
import { Providers } from "~/Providers";
import "~/styles/globals.css";

function MyApp(
  props: AppProps<{ initialReduxState: any; dehydratedState: any }>,
) {
  const { pageProps, Component } = props;
  return (
    <main className={GeistSans.className}>
      <Providers>
        <Component {...pageProps} />
      </Providers>
    </main>
  );
}

export default MyApp;
