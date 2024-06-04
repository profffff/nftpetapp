import { fromHex, isHex } from 'viem'


/**
 * Converts an IPFS URL to its corresponding HTTPS URL.
 *
 * @param {string} ipfsString - The input IPFS URL to be converted to HTTPS.
 * @returns {string} The converted HTTPS URL.
 */

//dweb.link - gateway works , ipfs.io - not,  cloudflare-ipfs.com - not tried
//
const ipfsToHttps = (ipfsString: string): string => {
    return ipfsString.replace('ipfs://', 'https://dweb.link/ipfs/')
}

/**
 * Retrieves an ID from a given hash value.
 *
 * @param {string | undefined} hashId - The hash value to extract the ID from.
 * @returns {string | undefined} The extracted ID, or the original hash value if it's not in the expected format.
 */
const getIdFromHash = (hashId: undefined | string): string | undefined => {
    return isHex(hashId)
        ? fromHex(hashId as '0x${string}', 'number').toString()
        : hashId
}



export { ipfsToHttps, getIdFromHash }
