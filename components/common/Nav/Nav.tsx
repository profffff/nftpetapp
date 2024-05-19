import { useRef, useState } from 'react'

import clsx from 'clsx'

import type { Dispatch, SetStateAction } from 'react'

// Hooks

// Components
import { ConnectButton,  NFTCollectionModal,
} from '@/components'


const Nav = () => {
    const navRef = useRef<HTMLElement>(null)
   

    


    return (
        <nav
            ref={navRef}
        >
            <div>
                
              <ConnectButton/>

        
       
            </div>


        </nav>
    )
}

export default Nav
