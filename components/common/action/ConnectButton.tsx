
import { useWeb3Modal } from '@web3modal/wagmi/react'


const ConnectButton = () => {
  // 4. Use modal hook
  const { open } = useWeb3Modal()

  return (
    <>
    <div>
      <button  className="button"
       onClick={() => open()}>CONNECT WALLET
      </button>
      </div>
      <div>
      <button className="button" onClick={() => open({ view: 'Networks' })}>CHOOSE NETWORK</button>
      </div>
    </>
  )
}

export default ConnectButton