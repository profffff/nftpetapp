import { type Dispatch, type SetStateAction, useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import clsx from 'clsx'

// Utilities
import { getIdFromHash, ipfsToHttps } from '@/utils'

// Requests
import { getNFTs } from '@/requests'

// Components
import {  } from '@/components'

import {IRefPhaserGame, MainMenuScene, NFTCollectionScene} from '@/src'



// Types
import { INFT } from '@/types'
import { MainMenu } from '@/src/scenes/MainMenuScene'



function NFTCollection({currentActiveScene}) {
    const { address } = useAccount()
    const [nftData, setNftData] = useState<INFT | null>(null)
    const { isConnected } = useAccount()

    const [isModalOpened, setIsModalOpened] = useState(false)

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
          if (scene.sys.config.key === 'MainMenu') 
            {
              if (isLoading || isFetching ) {
                  //loading...
              }
              else {
                const nftArray = data?.data?.ownedNfts.map((item) => ({
                  tokenId: item.id?.tokenId || '',
                  image: ipfsToHttps(item.metadata?.image || ''),
                  name: item.metadata?.name || '',
                }));
                 scene.loadNFTCollectionScene(nftArray); //from menu
              }
            }
          else if (scene.sys.config.key === 'NFTCollectionScene') 
            {
                scene.changeSceneToMainMenu();
            }
          }
    }


    const handleClick = () => {
      setIsModalOpened(!isModalOpened);
      loadCollectionScene();
    };


    return (
      <div> 
         <button  className="button" disabled={!isConnected || isLoading || isFetching}
          onClick={handleClick}
         >NFT COLLECTION</button> 
      </div>
    )
}

export default NFTCollection
