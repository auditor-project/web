/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type AppProps } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { api } from "~/utils/api";
import { MantineProvider } from "@mantine/core";
import "~/styles/globals.css";
import { Notifications } from "@mantine/notifications";

interface NextAppProps extends AppProps {
  Component: AppProps["Component"] & {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    PageLayout?: any;
  };
  session: Session | null;
}

const NextApp = ({ Component, pageProps }: NextAppProps) => {
  const { session } = pageProps;

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: "dark",
      }}
    >
      <Notifications position="top-right" />
      <SessionProvider session={session}>
        {Component.PageLayout ? (
          <Component.PageLayout>
            <Component {...pageProps} />
          </Component.PageLayout>
        ) : (
          <Component {...pageProps} />
        )}
      </SessionProvider>
    </MantineProvider>
  );
};

export default api.withTRPC(NextApp);
