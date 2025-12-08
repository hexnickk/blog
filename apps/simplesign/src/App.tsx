import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { createAppKit } from '@reown/appkit/react'
import { mainnet, type AppKitNetwork } from '@reown/appkit/networks'
import { Index } from './Index'

const queryClient = new QueryClient()

const projectId = 'b6647b9b137e8e54fcad2c8343305a93'

const metadata = {
  name: 'Simplesign',
  description: 'Simplesign App',
  url: 'http://localhost:5173',
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

const networks = [mainnet] as [AppKitNetwork, ...AppKitNetwork[]];

const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: false,
})

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true
  }
})

function App() {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <Index />
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App
