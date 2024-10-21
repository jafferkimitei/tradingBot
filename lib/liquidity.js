
const ccxt = require('ccxt');

async function checkLiquidity(tokenAddress) {
    const exchange = new ccxt.binance();
    const markets = await exchange.loadMarkets();

    const market = markets[tokenAddress];
    if (!market) {
        console.log(`Token address ${tokenAddress} not found on the exchange.`);
        return 0; // Instead of throwing an error, return 0 for invalid tokens
    }

    const liquidity = market.liquidity || 0;
    const price = market.last || 0;

    if (price > 1000) {
        console.log(`Token ${tokenAddress} has a high price: ${price}`);
    }

    return liquidity;
}

module.exports = { checkLiquidity };
