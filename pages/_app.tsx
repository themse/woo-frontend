import App, { AppProps, NextWebVitalsMetric, AppContext } from 'next/app';
import { FC } from 'react';
import Head from 'next/head';
import { ApolloProvider } from '@apollo/client';
import { NextPageContext } from 'next';

import { addApolloState, initializeApollo, useApollo } from '@/apollo/index';
import '@/styles/globals.css';

type MyAppType = FC<AppProps> & { getInitialProps: unknown };

const MyApp: MyAppType = ({ Component, pageProps }) => {
  const apolloClient = useApollo(pageProps || {});

  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
};

// eslint-disable-next-line @typescript-eslint/ban-types
MyApp.getInitialProps = async (appContext: AppContext): Promise<NextPageContext | {}> => {
  const { Component, ctx } = appContext;
  const apolloClient = initializeApollo();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  apolloClient.toJSON = () => null;
  const inAppContext = Boolean(appContext.ctx);

  let pageProps = {};

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  } else if (inAppContext) {
    pageProps = await App.getInitialProps(appContext);
  }

  const isServer = !!ctx.req;

  if (isServer) {
    const { AppTree } = ctx;

    if (ctx.res && ctx.res.writableEnded) {
      return pageProps;
    }

    pageProps = addApolloState(apolloClient, pageProps);
    try {
      const { getDataFromTree } = await import('@apollo/client/react/ssr');
      await getDataFromTree(<AppTree pageProps={pageProps} />);
    } catch (error) {
      console.error('Error while running `getDataFromTree`', error);
    }
    Head.rewind();
  }

  return { ...pageProps };
};

export function reportWebVitals(_metrics: NextWebVitalsMetric): void {
  // console.table(metrics);
}

export default MyApp;
