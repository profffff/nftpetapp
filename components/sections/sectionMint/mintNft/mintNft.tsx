
import { useRef, useState, useEffect, useMemo } from 'react'

import { 
  type BaseError,
  useWaitForTransactionReceipt, 
  useWriteContract,
  useAccount
} from 'wagmi'

import { getNFTMetadata } from '@/requests'

import {  InfoMessage,
  InfoMessageWrapper,
 } from '@/components'

 import { fromHex } from 'viem'

 import { useQuery, useQueryClient } from '@tanstack/react-query'

// Hooks
import { useIsWrongNetwork, useMint } from '@/hooks'

import { GetNfts, IMintedMetadata } from '@/types'
 
const mintNft = () => {
  const { address, isConnected, isDisconnected } = useAccount()
  const [showClaimedNFTModal, setShowClaimedNFTModal] = useState(false)
  const [mintedMetadata, setMintedMetadata] = useState<
  IMintedMetadata | null | undefined
>(null)

  const navRef = useRef<HTMLElement>(null)
  const [isModalOpened, setIsModalOpened] = useState(false)
  const { state, dispatch, mintNFT } = useMint()

  const [showNFTCollectionModal, setShowNFTCollectionModal] = useState(false)

  const queryClient = useQueryClient()



  //const [showClaimedNFTModal, setShowClaimedNFTModal] = useState(false)
  //const [showNFTGalleryModal, setShowNFTGalleryModal] = useState(false)
  const [mintedNFTId, setMintedNFTId] = useState<number | undefined>(
    undefined
)

  const { 
    data: hash,
    error,
    isPending, 
    writeContract 
  } = useWriteContract() 
  

  const {
    status: claimedMetadataStatus,
    isFetching: isClaimedMetadataFetching,
    isError: isClaimedMetadataError,
    data: claimedMetadata,
    refetch: fetchClaimedMetadata,
    error: claimedMetadataError,
    isSuccess: isClaimedMetadataSuccess,
} = useQuery({
    enabled: false,
    queryKey: ['nftURILink', mintedNFTId],
    queryFn: () => getNFTMetadata(mintedNFTId),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
})

useEffect(() => {
  if (mintedNFTId) {
      fetchClaimedMetadata()
  }
}, [mintedNFTId, fetchClaimedMetadata])

console.log('nftid', mintedNFTId)
console.log('claimedMetadata', claimedMetadata)

const claimedNFTModalData = useMemo(
  () => ({
      metadata: mintedMetadata,
      id: { tokenId: mintedMetadata?.id },
  }),
  [mintedMetadata]
)



  async function submit(e: React.FormEvent<HTMLFormElement>) { 
    e.preventDefault() 
    mintNFT(address);
  
  } 

  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ 
      hash, 
    }) 
    
    
    useEffect(() => {
      if (
          claimedMetadataStatus === 'success' ||
          claimedMetadataStatus === 'error'
      ) {
        console.log('claimedMetadataStatus', claimedMetadataStatus)
          setMintedNFTId(undefined)

          setMintedMetadata({
              ...claimedMetadata?.data?.metadata,
              id: claimedMetadata?.data?.id?.tokenId
          })
 

          queryClient.setQueryData( 
              ['userNfts', address],
              (oldData: null | undefined | GetNfts) => {
                console.log('oldData', oldData)
                  if (oldData?.data) {
                      return {
                          ...oldData,
                          data: {
                              ...oldData.data,
                              ownedNfts: [
                                  ...oldData.data.ownedNfts,
                                  { ...claimedMetadata?.data },
                              ],
                          },
                      }
                  }
              }
          )
   
      }
              }, [
                  claimedMetadataStatus,
                  claimedMetadata,
                //  queryClient,
                  address,
              ])

    console.log('state.receiptData', state.receiptData)
    
    console.log(mintedNFTId)
    useEffect(() => {
      console.log('state.receiptData from use effect',state.receiptData)
      const data = state.receiptData
      console.log('state.receiptData status from use effect',state.receiptData?.status)
      if (data?.status === 'success') {  
          const logsWithId = data?.logs?.find((item) => item.data === '0x')
          setMintedNFTId(
              logsWithId?.topics?.[3]
                  ? fromHex(logsWithId?.topics?.[3]!, 'number')
                  : undefined
          )
          console.log(fromHex(logsWithId?.topics?.[3]!, 'number'))
          console.log('mintedNFTId', mintedNFTId)
      }
  }, [state.receiptData])

  useEffect(() => {
    setMintedNFTId(undefined)
    setMintedMetadata(null)
    queryClient.removeQueries({ queryKey: ['nftURILink'], exact: false })
    dispatch(undefined)
}, [address, dispatch])

  console.log("claimedNFTModalData", claimedNFTModalData)
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