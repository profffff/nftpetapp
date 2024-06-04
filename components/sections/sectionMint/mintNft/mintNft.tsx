
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
 
interface MintNftProps {
  isSectionActive: boolean;
  MintNFTActive: (value: boolean) => void;
}

const mintNft = ({ isSectionActive, MintNFTActive }: MintNftProps) => {
  
const { address, isConnected } = useAccount()
const [mintedMetadata, setMintedMetadata] = useState<IMintedMetadata | null | undefined>(null)

const navRef = useRef<HTMLElement>(null)
const { state, dispatch, mintNFT } = useMint()

const queryClient = useQueryClient()

const [mintedNFTId, setMintedNFTId] = useState<number | undefined>( undefined)

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
      setMintedNFTId(undefined)

      setMintedMetadata({
          ...claimedMetadata?.data?.metadata,
          id: claimedMetadata?.data?.id?.tokenId
      })

      queryClient.setQueryData( 
          ['userNfts', address],
          (oldData: null | undefined | GetNfts) => {
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
     // queryClient,
      address,
  ])
    

useEffect(() => {
  const data = state.receiptData
  if (data?.status === 'success') {  
      const logsWithId = data?.logs?.find((item) => item.data === '0x')
      setMintedNFTId(
        // @ts-ignore
          logsWithId?.topics?.[3] // @ts-ignore 
              ? fromHex(logsWithId?.topics?.[3]!, 'number') 
              : undefined
      )
      MintNFTActive(false);
  }
}, [state.receiptData])

useEffect(() => {
    setMintedNFTId(undefined)
    setMintedMetadata(null)
    queryClient.removeQueries({ queryKey: ['nftURILink'], exact: false })
    dispatch(undefined)
}, [address, dispatch])

return (
    <nav ref={navRef} >
      <form onSubmit={submit}>
          <button className="button"
            disabled={!isConnected || isPending ||
              state.isLoading || !isSectionActive
            } 
            type="submit">
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
          isLoading={ state.isPrepareLoading || state.isReceiptLoading }
          isError={ state.isError }
          isActionRequired={state.isWriteLoading}>
        <InfoMessage
              isNoTokens={state.isNoTokens}
              isPrepareLoading={state.isPrepareLoading}
              prepareError={state.prepareError}
              isWriteLoading={state.isWriteLoading}
              isReceiptLoading={state.isReceiptLoading}
              receiptError={state.receiptError}
              transactionError={state.writeError}
              isWalletConnected={isConnected ? true : false}/>
      </InfoMessageWrapper>     
    </nav>
  )
}

export default mintNft