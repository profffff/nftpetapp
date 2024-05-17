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
        address: string | undefined
    ) => {
        dispatch(undefined)

        let prepareLoading = false
        let writeLoading = false
        let receiptLoading = false

        try {
            
            prepareLoading = true
            dispatch({ isPrepareLoading: true })
        

            const result = await simulateContract(config, {
                ...contractConfig,
                functionName: 'claim',
                args: [
                    address,
                    parseUnits("1", 0),
                    '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
                    parseEther("0"),
                    {
                        proof: [],
                        quantityLimitPerWallet:  parseUnits("1", 0),
                        pricePerToken: parseEther("0"),
                        currency: '0x0000000000000000000000000000000000000000',
                    },
                    '0x',
               ],
                value: parseEther("0"),
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
