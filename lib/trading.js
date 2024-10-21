// lib/trading.js
const ccxt = require('ccxt');

async function executeTrade(tokenAddress) {
    const exchange = new ccxt.binance({
        apiKey: process.env.BINANCE_API_KEY,
        secret: process.env.BINANCE_SECRET_KEY,
    });

    // Example trade logic: Buy a fixed amount of the token
    try {
        const symbol = tokenAddress; // e.g., 'ETH/USDT'
        const amount = 0.01; // Example amount
        const order = await exchange.createMarketBuyOrder(symbol, amount);
        console.log(`Trade executed:`, order);
        return order;
    } catch (error) {
        console.error(`Error executing trade for ${tokenAddress}:`, error);
        throw error;
    }
}

module.exports = { executeTrade };
