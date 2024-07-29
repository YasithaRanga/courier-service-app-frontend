import { initializeApollo, APOLLO_STATE_PROP_NAME } from '@/lib/apollo';
import { useMemo } from 'react';

function useApollo(pageProps: any) {
  const state = pageProps[APOLLO_STATE_PROP_NAME];
  const client = useMemo(
    () => initializeApollo({ initialState: state }),
    [state]
  );

  return client;
}

export default useApollo;
