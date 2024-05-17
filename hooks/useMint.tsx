import { useReducer } from 'react'
import { BaseError, parseEther, parseUnits } from 'viem'
import { useConfig } from 'wagmi'
import {
    simulateContract,
    writeContract,
    waitForTransactionReceipt,
} from '@wagmi/core'

// Contract
import { contractConfig } from '@/contract'

// Reducers
import { useMintReducer } from '@/reducers'

// Utilities
import { toErrorWithMessage } from '@/utils'

const pricePerNFT = +process.env.NEXT_PUBLIC_NFT_PRICE! as unknown as number

const useMint = () => {
    const config = useConfig()
    const [state, dispatch] = useReducer(useMintReducer, {
        isLoading: false,
        isError: false,
        customError: null,
        isPrepareLoading: false,
        isPrepareSuccess: false,
        prepareError: null,
        isWriteLoading: false,
        isWriteSuccess: false,
        writeError: null,
        isReceiptLoading: false,
        isReceiptSuccess: false,
        receiptError: null,
        receiptData: null,
        isWalletConnected: false
    })

    const mintNFT = async (
        quantity: string,
        address: string | undefined
    ) => {
        dispatch(undefined)

        let prepareLoading = false
        let writeLoading = false
        let receiptLoading = false

        try {
            
            prepareLoading = true
            dispatch({ isPrepareLoading: true })
           
            // const result = await simulateContract(config, {
            //     ...contractConfig,
            //     functionName: 'mintTo',
            //     args: [
            //         '0x3Ed961CD654d71864661ACf3c761B65D74F10026',
            //         'ipfs://QmTSQM8nVzR68pCxuzXrQZpmfpfwfxtjdXCj7JvA3JvFf9/'
            //    ]

            // })
            
            const result = await simulateContract(config, {
                ...contractConfig,
                functionName: 'safeTransferFrom',
                args: [
                    '0x3Ed961CD654d71864661ACf3c761B65D74F10026',
                    '0x3Ed961CD654d71864661ACf3c761B65D74F10026',
                    3
               ]

            })

            prepareLoading = false
            writeLoading = true
            dispatch({
                isPrepareLoading: false,
                isPrepareSuccess: true,
                isWriteLoading: true,
            })

           
            const writeResult = await writeContract(config, result.request)

            writeLoading = false
            receiptLoading = true
            dispatch({
                isWriteLoading: false,
                isWriteSuccess: true,
                isReceiptLoading: true,
            })

            const data = await waitForTransactionReceipt(config, {
                hash: writeResult,
            })

            receiptLoading = false

            dispatch({
                isReceiptLoading: false,
                isReceiptSuccess: data?.status === 'success',
               // receiptData: data,
            })
        } catch (error: unknown) {
            alert(error)
            console.error(error);
            if (error instanceof BaseError) {
                if (prepareLoading) { 
                    dispatch({
                        prepareError: error?.shortMessage || error?.message,
                    })
                } else if (writeLoading) { ;
                    dispatch({
                        writeError: error?.shortMessage || error?.message,
                    })
                } else if (receiptLoading) { 
                    dispatch({ 
                        receiptError: error?.shortMessage || error?.message,
                    })
                }
            } else { 
                dispatch({ 
                    customError: toErrorWithMessage(error).message,
                })
            }
        } finally {
            dispatch({
                isPrepareLoading: false,
                isWriteLoading: false,
                isReceiptLoading: false,
            })
        }
    }

    return { state, dispatch, mintNFT }
}

export default useMint
