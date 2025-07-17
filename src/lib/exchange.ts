// src/lib/exchange.ts

export interface ErApiResponse {
  result: 'success' | string;
  base_code: string;
  rates: Record<string, number>;
  error_type?: string;
}

// Main exchange rate fetcher
export async function fetchRate(from: string, to: string): Promise<number> {
  try {
    // Primary API: Open ER API (works for fiat-fiat)
    const res = await fetch(`https://open.er-api.com/v6/latest/${from}`);
    if (!res.ok) {
      throw new Error(`Exchange API HTTP error: ${res.status}`);
    }

    const j: ErApiResponse = await res.json();
    if (j.result !== 'success') {
      throw new Error(`Rate lookup failed: ${j.error_type || 'unknown error'}`);
    }

    const rate = j.rates[to];
    if (typeof rate !== 'number') {
      throw new Error(`Rate for ${from}->${to} not found in response`);
    }

    return rate;
  } catch (err) {
    console.warn(`[fetchRate] Primary API failed, trying fallback: ${err}`);
    return await fetchCryptoRateFallback(from, to);
  }
}

// Symbol → CoinGecko ID mapper
function mapSymbolToCoinGeckoId(symbol: string): string {
  const symbolMap: Record<string, string> = {
    BTC: 'bitcoin',
    ETH: 'ethereum',
    USDT: 'tether',
    BNB: 'binancecoin',
    DOGE: 'dogecoin',
    SOL: 'solana',
    XRP: 'ripple',
    LTC: 'litecoin',
    TRX: 'tron',
    MATIC: 'matic-network',
    USD: 'usd',
    RUB: 'russian-ruble',
  };

  return symbolMap[symbol.toUpperCase()] || symbol.toLowerCase();
}

// Fallback for crypto/fiat rates via CoinGecko
export async function fetchCryptoRateFallback(from: string, to: string): Promise<number> {
  const fromId = mapSymbolToCoinGeckoId(from);
  const toCurrency = to.toLowerCase();

  // Try direct conversion first
  let url = `https://api.coingecko.com/api/v3/simple/price?ids=${fromId}&vs_currencies=${toCurrency}`;
  let res = await fetch(url);
  if (!res.ok) {
    throw new Error(`CoinGecko API HTTP error: ${res.status}`);
  }

  let json = await res.json();

  if (json[fromId] && typeof json[fromId][toCurrency] === 'number') {
    return json[fromId][toCurrency];
  }

  // If direct conversion fails and we’re trying to convert fiat → crypto, try the reverse and invert
  const toId = mapSymbolToCoinGeckoId(to);
  const fromCurrency = from.toLowerCase();
  url = `https://api.coingecko.com/api/v3/simple/price?ids=${toId}&vs_currencies=${fromCurrency}`;
  res = await fetch(url);
  if (!res.ok) {
    throw new Error(`CoinGecko fallback API HTTP error: ${res.status}`);
  }

  json = await res.json();

  if (json[toId] && typeof json[toId][fromCurrency] === 'number') {
    return 1 / json[toId][fromCurrency];
  }

  throw new Error(`CoinGecko rate not found for ${from} → ${to} (even after fallback)`);
}
