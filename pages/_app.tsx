import App, { AppProps, NextWebVitalsMetric, AppContext, AppInitialProps } from 'next/app';
import { FC } from 'react';
import '@/styles/globals.css';

type MyAppType = FC<AppProps> & { getInitialProps: typeof App.getInitialProps };

const MyApp: MyAppType = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

MyApp.getInitialProps = async (appContext: AppContext): Promise<AppInitialProps> => {
  const appProps = await App.getInitialProps(appContext);

  return { ...appProps };
};

export function reportWebVitals(metrics: NextWebVitalsMetric): void {
  console.table(metrics);
}

export default MyApp;
