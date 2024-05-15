
import { useRef, useState } from 'react'

import { 
  type BaseError,
  useWaitForTransactionReceipt, 
  useWriteContract,
  useAccount
} from 'wagmi'
//import { abi } from '@/components'

// Hooks
import { useIsWrongNetwork, useMint } from '@/hooks'
 
const mintNft = () => {
  const { address, isConnected } = useAccount()
  const [showClaimedNFTModal, setShowClaimedNFTModal] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const [isModalOpened, setIsModalOpened] = useState(false)
  const { state, dispatch, mintNFT } = useMint()

  const [inputValue, setInputValue] = useState('1')
  const [quantity, setQuantity] = useState(inputValue)

  //const [showClaimedNFTModal, setShowClaimedNFTModal] = useState(false)
  //const [showNFTGalleryModal, setShowNFTGalleryModal] = useState(false)


  const { 
    data: hash,
    error,
    isPending, 
    writeContract 
  } = useWriteContract() 

  async function submit(e: React.FormEvent<HTMLFormElement>) { 
    e.preventDefault() 
    mintNFT(quantity, address)
    const formData = new FormData(e.target as HTMLFormElement) 
    //const tokenId = formData.get('tokenId') as string 
    const tokenId = "0x1b0E2b2864fFB39360f05907eAB5f86acA22b5ce" as string
    // writeContract({
    //   address: '0x3Ed961CD654d71864661ACf3c761B65D74F10026', //who to send
    //   abi,
    //   functionName: 'mint',
    //   args: [BigInt(tokenId)],
    // })
  } 

  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ 
      hash, 
    }) 

    //<input name="address" placeholder="0xA0Cf…251e" required />
    //<input name="value" placeholder="0.05" required />
  return (
    <nav
            ref={navRef}
        >
    <form onSubmit={submit}>

     

      
      <button className="button"
        disabled={isPending} 
        type="submit"
      >
        {isPending ? 'Confirming...' : 'Mint'} 
      </button>
      {hash && <div>Transaction Hash: {hash}</div>}
      {isConfirming && <div>Waiting for confirmation...</div>} 
      {isConfirmed && <div>Transaction confirmed.</div>} 
      {error && (
        <div>Error: {(error as BaseError).shortMessage || error.message}</div>
      )}
    </form>

  
        
    </nav>
  )
}

export default mintNft