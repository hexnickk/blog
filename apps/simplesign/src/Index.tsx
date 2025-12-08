import { useState } from 'react'
import { useConnection, useDisconnect, useSignMessage } from 'wagmi'
import { useAppKitWallet } from '@reown/appkit-wallet-button/react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardFooter } from '@/components/ui/card'

function getFriendlyErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    // Check for user rejection via name or code property
    if (
      ('name' in err && err.name === 'UserRejectedRequestError') ||
      ('code' in err && (err as { code: unknown }).code === 4001)
    ) {
      return 'Request rejected in wallet.'
    }

    // Check for shortMessage property, common in viem errors
    if (
      'shortMessage' in err &&
      typeof (err as { shortMessage: unknown }).shortMessage === 'string'
    ) {
      const shortMessage = (err as { shortMessage: string }).shortMessage
      if (shortMessage.includes('An unknown RPC error occurred')) {
        return 'An unknown RPC error occurred. Please check your wallet or network and try again.'
      }
      return shortMessage
    }

    // Fallback to generic string check for rejection
    if (String(err).includes('User rejected')) {
      return 'Request rejected in wallet.'
    }
  }
  return 'An unexpected error occurred.'
}

export function Index() {
  const { address, isConnected } = useConnection()
  const { disconnectAsync, isPending: isDisconnecting } = useDisconnect()
  const { signMessageAsync, isPending: isSigning } = useSignMessage()
  const { connect } = useAppKitWallet()

  const [messageToSign, setMessageToSign] = useState('Hello, SimpleSign!')
  const [signedMessage, setSignedMessage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      setError(null)
      await connect('walletConnect')
    } catch (err) {
      console.error('Failed to connect wallet:', err)
      setError(`Connection failed: ${getFriendlyErrorMessage(err)}`)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    try {
      setError(null)
      await disconnectAsync()
    } catch (err) {
      console.error('Failed to disconnect wallet:', err)
      setError(`Disconnection failed: ${getFriendlyErrorMessage(err)}`)
    }
  }

  const handleSignMessage = async () => {
    try {
      setError(null)
      setSignedMessage('')
      const signature = await signMessageAsync({ message: messageToSign })
      setSignedMessage(signature)
    } catch (err) {
      console.error('Error signing message:', err)
      setError(`Signing failed: ${getFriendlyErrorMessage(err)}`)
    }
  }

  return (
    <div className='max-w-xl mx-auto p-6'>
      {error && (
        <Card className='mb-4 border-red-200 bg-red-50'>
          <CardContent className='p-4'>
            <p className='font-semibold text-red-700'>Error</p>
            <p className='text-red-600'>{error}</p>
          </CardContent>
        </Card>
      )}

      {!isConnected && (
        <Button onClick={handleConnect} disabled={isConnecting}>
          {isConnecting ? 'Connecting...' : 'Connect with WalletConnect'}
        </Button>
      )}

      {isConnected && (
        <div>
          <Card className='mb-4'>
            <CardContent>
              <p>Connected Address: {address}</p>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleDisconnect}
                variant="secondary"
                disabled={isDisconnecting}
              >
                {isDisconnecting ? 'Disconnecting...' : 'Disconnect Wallet'}
              </Button>
            </CardFooter>
          </Card>

          <div className="flex flex-col gap-2">
            <Textarea
              value={messageToSign}
              onChange={(e) => setMessageToSign(e.target.value)}
              placeholder="Message to sign"
            />
            <Button onClick={handleSignMessage} disabled={isSigning}>
              {isSigning ? 'Signing...' : 'Sign Message'}
            </Button>
          </div>

          {signedMessage && (
            <div>
              <p>Signed Message:</p>
              <p className='break-all'>{signedMessage}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
