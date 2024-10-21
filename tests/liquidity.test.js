const { checkLiquidity, detectScam } = require('../lib/liquidity');

// Mocking ccxt for testing purposes
jest.mock('ccxt', () => ({
    binance: jest.fn().mockImplementation(() => ({
        loadMarkets: jest.fn().mockResolvedValue({
            'ETH/USDT': { liquidity: 50000, quoteVolume: 2000, last: 2000 },
            'BTC/USDT': { liquidity: 30000, quoteVolume: 10000, last: 60000 },
        }),
    })),
}));

describe('Liquidity Module', () => {

    test('checkLiquidity returns correct liquidity for a valid token', async () => {
        const liquidity = await checkLiquidity('ETH/USDT');
        expect(liquidity).toBe(50000); // Expecting the liquidity of ETH/USDT to be 50000
    });

    test('checkLiquidity returns 0 for an invalid token', async () => {
        const liquidity = await checkLiquidity('INVALID/TOKEN');
        expect(liquidity).toBe(0); // Invalid token should return 0 liquidity
    });

    test('detectScam returns false for valid token', async () => {
        const isScam = await detectScam('ETH/USDT');
        expect(isScam).toBe(false); // ETH/USDT is not a scam
    });

    test('detectScam returns false for a high liquidity token', async () => {
        const isScam = await detectScam('BTC/USDT');
        expect(isScam).toBe(false); // BTC/USDT is valid and has high volume
    });

    test('detectScam returns true for non-existent token', async () => {
        const isScam = await detectScam('NONEXISTENT/TOKEN');
        expect(isScam).toBe(true); // Non-existent token should be considered a scam
    });

});
