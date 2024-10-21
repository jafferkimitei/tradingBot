// Function to format a number to a fixed decimal point
function formatNumber(num, decimals = 8) {
    return parseFloat(num).toFixed(decimals);
}

// Function to calculate slippage percentage
function calculateSlippage(expectedPrice, executedPrice) {
    if (expectedPrice === 0) return 0;
    return ((executedPrice - expectedPrice) / expectedPrice) * 100;
}

// Function to check liquidity based on available balance and market depth
function checkLiquidity(balance, marketDepth) {
    const totalLiquidity = marketDepth.reduce((acc, order) => acc + order.amount, 0);
    return balance >= totalLiquidity;
}

// Function to check if a token is valid based on its properties
function isValidToken(token) {
    return (
        token.market_cap > 0 &&
        token.price > 0 &&
        token.liquidity > 0 &&
        !token.is_scam &&
        token.age > 0 // Ensure the token has been around for a certain period
    );
}

// Function to get the current timestamp
function getCurrentTimestamp() {
    return Math.floor(Date.now() / 1000);
}

// Function to sleep for a specified duration (in milliseconds)
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to log messages with timestamps
function logMessage(message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
}

// Function to get the percentage change
function getPercentageChange(oldValue, newValue) {
    if (oldValue === 0) return 0;
    return ((newValue - oldValue) / oldValue) * 100;
}

module.exports = {
    formatNumber,
    calculateSlippage,
    checkLiquidity,
    isValidToken,
    getCurrentTimestamp,
    sleep,
    logMessage,
    getPercentageChange,
};
