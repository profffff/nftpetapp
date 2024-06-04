import { useEffect, useState } from 'react'
import { useQuery  } from '@tanstack/react-query'
import { useAccount } from 'wagmi'

import { ipfsToHttps } from '@/utils'

import { getNFTs } from '@/requests'

import { INFT } from '@/types'


function NFTCollection({currentActiveScene}) {

  const { address } = useAccount()
  const [nftData, setNftData] = useState<INFT | null>(null)
  const { isConnected } = useAccount()

  const { data, isLoading, isFetching } = useQuery({
      queryKey: ['userNfts', address],
      enabled: !!address,
      queryFn: () => getNFTs(address),
      staleTime: Infinity,
      refetchOnWindowFocus: false,
  })  

  useEffect(() => {
    const totalCount = data?.data?.totalCount
    if (totalCount) {
        setNftData(data?.data?.ownedNfts?.[totalCount - 1] || null) //last owned nft
    }
  }, [data])

    const loadCollectionScene = () => {
      if(currentActiveScene) 
        {
          const scene = currentActiveScene.scene;
          const keyScene = scene.sys.config.key;
          if (keyScene === 'MainMenu' ) 
            {
              if (isLoading || isFetching ) {
                  //loading...
              }
              else {
                const nftArray = data?.data?.ownedNfts.map((item) => ({
                  tokenId: item.id?.tokenId || '',
                  image: ipfsToHttps(item.metadata?.image || ''),
                  name: item.metadata?.name || '',
                }))
                 scene.loadNFTCollectionScene(nftArray); //from menu
              }
            }
          else if (keyScene === 'NFTCollectionScene') 
            {
                scene.changeSceneToMainMenu();
            }
        }
    }

    const handleClick = () => {
      loadCollectionScene();
    };

    return (
      <div> 
         <button  className="button" disabled={!isConnected || isLoading || isFetching }
          onClick={handleClick}
         >NFT COLLECTION</button> 
      </div>
    )
}

export default NFTCollection