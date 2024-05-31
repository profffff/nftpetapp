// Components
import { LoaderDots } from '@/components'

// Types
import { IMintedMetadata } from '@/types'

interface IProps {
    isPrepareLoading: boolean
    prepareError: string | null
    isWriteLoading: boolean
    isReceiptLoading: boolean
    receiptError: string | null
    transactionError: string | null
    isWalletConnected: boolean,
    isNoTokens: boolean
}

const InfoMessage = ({
    isPrepareLoading,
    prepareError,
    isWriteLoading,
    isReceiptLoading,
    receiptError,
    transactionError,
    isWalletConnected,
    isNoTokens, 
}: IProps) => {


    if (isNoTokens) {
        return <>Out of NFT! Wait fot the new drop or contact the admin </>
    }

    if (prepareError) {
        return <>Error: {prepareError}. Try again?</>
    }

    if (transactionError === 'User rejected the request.') {
        return <>You&apos;ve canceled the transaction. Try again?</>
    }

    if (transactionError) {
        return <>Error: {transactionError}. Try again?</>
    }

    if (receiptError) {
        return <>Error: {receiptError}. Try again?</>
    }

    if (isPrepareLoading) {
        return (
            <>
                <span>
                    Executing your transaction. Please wait
                    <LoaderDots />
                </span>
            </>
        )
    }

    if (isWriteLoading)
        return (
            <>
                <span>
                    <span className="font-bold">Action required: </span>
                    Please confirm transaction in your wallet to continue.
                </span>
            </>
        )

    if (isReceiptLoading)
        return (
            <>
                Waiting for the receipt
                <LoaderDots />
            </>
        )

     if (!isWalletConnected )
         return <>Wallet isn&apos;t connected!</>

    // if (isWalletConnected)
    //     return <>You should choose Amoy testnet and 
    //     have enough MATIC in your account to mint nft! </>

    // if (!isEnoughBalanceToMint) {
    //     return <> Error: Not enough balance.</>
    // }

    return <>Raise your pet and earn an NFT as a reward.</>
}

export default InfoMessage
