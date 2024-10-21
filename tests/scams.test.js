// tests/scams.test.js
const { detectScam } = require('../lib/scams');
const ccxt = require('ccxt');

// Mocking ccxt for testing purposes
jest.mock('ccxt', () => ({
    binance: jest.fn().mockImplementation(() => ({
        loadMarkets: jest.fn().mockResolvedValue({
            'ETH/USDT': { liquidity: 10000 },
            'BTC/USDT': { liquidity: 2000 },
            'SCAM/USDT': { liquidity: 10 },
        }),
    })),
}));

describe('Scam Detection Module', () => {

    test('detectScam returns false for a valid token', async () => {
        const isScam = await detectScam('ETH/USDT');
        expect(isScam).toBe(false); // ETH/USDT is not a scam
    });

    test('detectScam returns true for a non-existent token', async () => {
        const isScam = await detectScam('INVALID/TOKEN');
        expect(isScam).toBe(true); // Invalid token should be flagged as a scam
    });

    test('detectScam returns true for a low liquidity token', async () => {
        const isScam = await detectScam('SCAM/USDT');
        expect(isScam).toBe(true); // SCAM/USDT should be flagged due to low liquidity
    });

    test('detectScam returns false for a token with moderate liquidity', async () => {
        const isScam = await detectScam('BTC/USDT');
        expect(isScam).toBe(false); // BTC/USDT is not a scam, but has lower liquidity than ETH/USDT
    });
});
