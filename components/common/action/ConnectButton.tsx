import { useWeb3Modal } from '@web3modal/wagmi/react'

import { useAccount } from 'wagmi'

const ConnectButton = () => {

// modal hook
const { open } = useWeb3Modal()

const { isConnected } = useAccount()
  
  return (
    <>
    <div>
      <button  className="button"
       onClick={() => open()}>CONNECT WALLET
      </button>
      </div>
      <div>
      <button className="button" disabled={!isConnected} onClick={() => open({ view: 'Networks' })}>CHOOSE NETWORK</button>
      </div>
    </>
  )

}

export default ConnectButton