import { ApolloClient, HttpLink, NormalizedCacheObject } from '@apollo/client';
import { useMemo } from 'react';
import getConfig from 'next/config';
import merge from 'deepmerge';
import isEqual from 'lodash.isequal';

import { cache } from './cache';

const {
  publicRuntimeConfig: { GRAPHQL_SCHEMA_PATH },
} = getConfig();

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__';

interface PagePropsType {
  [APOLLO_STATE_PROP_NAME]?: NormalizedCacheObject;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

let globalApolloClient: ApolloClient<NormalizedCacheObject> | undefined;

const createApolloClient = (): ApolloClient<NormalizedCacheObject> => {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    cache,
    link: new HttpLink({
      uri: GRAPHQL_SCHEMA_PATH,
    }),
  });
};

export const initializeApollo = (
  initialState: NormalizedCacheObject | null = null,
): ApolloClient<NormalizedCacheObject> => {
  const apolloClient = globalApolloClient ?? createApolloClient();

  // hydration data
  if (initialState) {
    // get cache from client side
    const existingCache = apolloClient.extract();

    // Merge the existing cache into data passed from getStaticProps/getServerSideProps

    const data = merge(initialState, existingCache, {
      arrayMerge: (destionationArray, sourceArray) => [
        ...sourceArray,
        ...destionationArray.filter((dest) => sourceArray.every((src) => !isEqual(dest, src))),
      ],
    });

    // Restore the cache with merged data
    apolloClient.cache.restore(data);
  }

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') {
    return apolloClient;
  }

  // Create the Apollo Client once in the client
  if (!globalApolloClient) {
    globalApolloClient = apolloClient;
  }

  return apolloClient;
};

export const addApolloState = (
  client: ApolloClient<NormalizedCacheObject>,
  pageProps: PagePropsType,
): PagePropsType => {
  const newPageProps: PagePropsType = {};

  if (pageProps) {
    newPageProps[APOLLO_STATE_PROP_NAME] = client.cache.extract();
  }

  return { ...pageProps, ...newPageProps };
};

export const useApollo = (pageProps: PagePropsType): ApolloClient<NormalizedCacheObject> => {
  const initialState = pageProps[APOLLO_STATE_PROP_NAME];

  return useMemo(() => initializeApollo(initialState), [initialState]);
};
