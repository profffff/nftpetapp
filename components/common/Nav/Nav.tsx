import { useRef } from 'react'

// Components
import { ConnectButton, 
} from '@/components'


const Nav = () => {
    const navRef = useRef<HTMLElement>(null)
    return (
        <nav ref={navRef}>
            <div> 
              <ConnectButton/>   
            </div>
        </nav>
    )
}

export default Nav
