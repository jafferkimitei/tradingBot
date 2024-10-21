const { ethers } = require('ethers');

// Replace with your actual Infura Project ID
const infuraProjectId = '09a0497894d041f299fb36be3c86f284'; // Make sure to replace this with your actual project ID

// Initialize the provider
const provider = new ethers.InfuraProvider('mainnet', infuraProjectId);

async function fetchBlockWithRetries(provider, blockNumber, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            return await provider.getBlock(blockNumber);
        } catch (error) {
            if (i === retries - 1) throw error; 
            console.log(`Retrying... (${i + 1}/${retries})`);
        }
    }
}

async function detectNewToken(tokenAddress) {
    try {
        // Check if the address is a contract
        const code = await provider.getCode(tokenAddress);
        if (code === '0x') {
            console.error(`Address ${tokenAddress} is not a contract.`);
            return false; // Address is not a contract, hence not a new token
        }

        // Fetch the transaction count
        const transactionCount = await provider.getTransactionCount(tokenAddress);

        // Fetch the creation transaction (the one with nonce 0)
        const creationTx = await provider.getTransactionReceipt(tokenAddress);

        // If creationTx is null, the address is invalid
        if (!creationTx) {
            console.error(`No transaction found for token address ${tokenAddress}`);
            return false; // Not a new token if transaction does not exist
        }

        // Get the block details where the contract was created
        const block = await fetchBlockWithRetries(provider, creationTx.blockNumber);
        // Compare the block timestamp with current time
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        const creationTime = block.timestamp; // Block timestamp in seconds
        const oneDayInSeconds = 24 * 60 * 60; // One day in seconds

        if (currentTime - creationTime < oneDayInSeconds) {
            console.log(`Token ${tokenAddress} is less than 1 day old.`);
            return true; // Token is new
        } else {
            console.log(`Token ${tokenAddress} is more than 1 day old.`);
            return false; // Token is not new
        }
    } catch (error) {
        console.error(`Error fetching token creation time: ${error.message}`);
        return false; // Not a new token on error
    }
}

// Test the function with a token address
(async () => {
    const tokenAddress = '0xfdb676331a4b37689b2ea12f14ff895b640a4379'; // Test token address
    const isNewToken = await detectNewToken(tokenAddress);
    console.log(`Is the token ${tokenAddress} new? ${isNewToken}`);
})();
