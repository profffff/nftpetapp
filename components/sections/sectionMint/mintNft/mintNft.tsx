
import { useRef, useState } from 'react'

import { 
  type BaseError,
  useWaitForTransactionReceipt, 
  useWriteContract,
  useAccount
} from 'wagmi'

import {  InfoMessage,
  InfoMessageWrapper,
 } from '@/components'

// Hooks
import { useIsWrongNetwork, useMint } from '@/hooks'
 
const mintNft = () => {
  const { address, isConnected, isDisconnected } = useAccount()
  const [showClaimedNFTModal, setShowClaimedNFTModal] = useState(false)

  const navRef = useRef<HTMLElement>(null)
  const [isModalOpened, setIsModalOpened] = useState(false)
  const { state, dispatch, mintNFT } = useMint()

  const [showNFTCollectionModal, setShowNFTCollectionModal] = useState(false)





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
    mintNFT(address)
  } 

  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ 
      hash, 
    }) 
  
  return (
    <nav
            ref={navRef}
        >
    <form onSubmit={submit}>
  
      <button className="button"
        disabled={!isConnected || isPending ||
          state.isLoading
        } 
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

    <InfoMessageWrapper
                        isLoading={
                            state.isPrepareLoading ||
                            state.isReceiptLoading
                        }
                        isError={
                            state.isError 
                        }
                        isActionRequired={state.isWriteLoading}
                    >
                    <InfoMessage
                            isNoTokens={state.isNoTokens}
                            isPrepareLoading={state.isPrepareLoading}
                            prepareError={state.prepareError}
                            isWriteLoading={state.isWriteLoading}
                            isReceiptLoading={state.isReceiptLoading}
                            receiptError={state.receiptError}
                            transactionError={state.writeError}
                            isWalletConnected={isConnected ? true : false} 
                        />

                    </InfoMessageWrapper>
      
    </nav>
  )
}

export default mintNft