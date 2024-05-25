import { useRef, useState } from 'react';
import { createWeb3Modal } from '@web3modal/wagmi/react'

import { http, createConfig, WagmiProvider, useAccount } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { defineChain } from 'viem'
import { walletConnect, injected, coinbaseWallet } from 'wagmi/connectors'

import { IRefPhaserGame, PhaserGame } from '../game/PhaserGame';
import { MainMenu } from '../scenes/GameScene/Game';

import type { AppProps } from "next/app";


// Components
import {
    NavSection,
    MintNftSection,
    NFTCollectionSection
} from '@/components'
import NFTCollectionScene from '../scenes/NFTCollectionScene';

// Hooks
//import { useIsMounted } from '@/hooks'

const RPC_PUBLIC = process.env.NEXT_PUBLIC_RPC_PUBLIC as string
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID as string
const WALLET_CONNECT_PROJECT_ID = process.env
    .NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string
const ALCHEMY_ID = process.env.NEXT_PUBLIC_ALCHEMY as string


const queryClient = new QueryClient()

const preferredChain = defineChain({
    id: Number(CHAIN_ID),
    name: 'Polygon Amoy',
    network: 'polygonamoy',
    nativeCurrency: {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18,
    },
    rpcUrls: {
        alchemy: {
            http: ['https://polygon-amoy.g.alchemy.com/v2'],
            webSocket: ['wss://polygon-amoy.g.alchemy.com/v2'],
        },
        infura: {
            http: ['https://polygon-amoy.infura.io/v3'],
            webSocket: ['wss://polygon-amoy.infura.io/ws/v3'],
        },
        default: {
            http: [RPC_PUBLIC],
        },
        public: {
            http: [RPC_PUBLIC],
        },
    },
    blockExplorers: {
        etherscan: {
            name: 'PolygonScan',
            url: 'https://amoy.polygonscan.com',
        },
        default: {
            name: 'PolygonScan',
            url: 'https://amoy.polygonscan.com',
        },
    },
    testnet: true,
})

const projectId = WALLET_CONNECT_PROJECT_ID

const metadata = {
    name: 'nftpet',
    description: 'nftpet',
    url: 'https://nftpet.cloudns.be', // origin must match your domain & subdomain
    icons: ['https://avatars.githubusercontent.com/u/37784886']
  }

  const config = createConfig({
    chains: [mainnet, preferredChain],
    transports: {
      [mainnet.id]: http(),
      [preferredChain.id]: http()
    },
    connectors: [
      walletConnect({ projectId, metadata, showQrModal: false }),
      injected({ shimDisconnect: false }),
      coinbaseWallet({
        appName: metadata.name,
        appLogoUrl: metadata.icons[0]
      })
    ]
  })

  createWeb3Modal({
    wagmiConfig: config,
    projectId,
    enableAnalytics: false, // Optional - defaults to your Cloud configuration
    enableOnramp: false // Optional - false as default
  })


  let nftCollectionScene: Phaser.Scene;

function App()
{
    const [canMoveSprite, setCanMoveSprite] = useState(true);
    const phaserRef = useRef<IRefPhaserGame | null>(null);

    const addSprite = () => {

        if (phaserRef.current)
        {
            const scene = phaserRef.current.scene;

            if (scene)
            {
                const x = Phaser.Math.Between(64, scene.scale.width - 64);
                const y = Phaser.Math.Between(64, scene.scale.height - 64);
    
                const star = scene.add.sprite(x, y, 'star');
    
                scene.add.tween({
                    targets: star,
                    duration: 500 + Math.random() * 1000,
                    alpha: 0,
                    yoyo: true,
                    repeat: 3,
                    onComplete: () => {
                        star.destroy()
                    }
                });

            }
        }
    }

    const currentScene = (scene: Phaser.Scene) => {
        setCanMoveSprite(scene.scene.key !== 'MainMenu');
    }

    return (
        
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
       
                    <div id="app">
                        <PhaserGame ref={phaserRef} currentActiveScene={currentScene} /> 
                        <div>
                            <div>
                                <button className="button" onClick={addSprite}>MOOD++ ^_^</button>
                            </div>
                            <NavSection />
                            <NFTCollectionSection currentActiveScene={phaserRef.current} />
                            <MintNftSection />
                        </div>
                    </div>
          
            </QueryClientProvider>
        </WagmiProvider>
    )
}

export default App
