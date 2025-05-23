import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { WagmiProvider } from 'wagmi'

import App from './App'
import { wagmiConfig } from './wagmi.config'

// eslint-disable-next-line no-console
console.table(import.meta.env)

const queryClient = new QueryClient()

// biome-ignore lint/style/noNonNullAssertion: <explanation>
const root = createRoot(document.querySelector('#root')!)
root.render(
  <WagmiProvider config={wagmiConfig}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </WagmiProvider>,
)