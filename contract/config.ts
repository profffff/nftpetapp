import { contractABI } from './contractABI'

export const contractConfig = {
    address: process.env.NEXT_PUBLIC_CONTRACT as string,
    abi: contractABI,
}
