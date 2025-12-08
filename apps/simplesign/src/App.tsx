import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { createAppKit } from '@reown/appkit/react'
import { mainnet, type AppKitNetwork } from '@reown/appkit/networks'
import { Index } from './Index'

const queryClient = new QueryClient()

const projectId = '7131b44ae86375400bbad818698ec2c3'

const metadata = {
  name: 'Simplesign',
  description: 'Simplesign App',
  url: window.location.origin,
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
