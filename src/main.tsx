import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { SWRConfig } from 'swr';

import Routes from './routes';
import env from './utils/env';

const CACHE_KEY = '@swr/cache';

import { Cache } from 'swr';

function localStorageProvider(cache: Readonly<Cache<any>>): Cache<any> {
  const map = new Map(JSON.parse(localStorage.getItem(CACHE_KEY) || '[]'));

  window.addEventListener('beforeunload', () => {
    const appCache = JSON.stringify(Array.from(map.entries()));

    localStorage.setItem(CACHE_KEY, appCache);
  });

  return cache;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <SWRConfig
    value={{
      fetcher: async (key) => {
        const response = await fetch(`${env.VITE_BACKEND_URL}/${key}`);
        return response.json();
      },
      provider: localStorageProvider,
    }}
  >
    <ChakraProvider>
      <Routes />
    </ChakraProvider>
  </SWRConfig>
);
