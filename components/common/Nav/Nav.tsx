import { useRef, useState } from 'react'
import { useAccount } from 'wagmi'
import clsx from 'clsx'

// Hooks

// Components
import { ConnectButton } from '@/components'


const Nav = () => {
    const navRef = useRef<HTMLElement>(null)
    const { isConnected } = useAccount()

    const [isModalOpened, setIsModalOpened] = useState(false)


    return (
        <nav
            ref={navRef}
        >
            <div>
                
              <ConnectButton />

            </div>

        </nav>
    )
}

export default Nav
