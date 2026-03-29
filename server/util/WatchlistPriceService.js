const { getQuote } = require("./FinnhubClient");
const StockSymbolMap = require("./StockSymbolMap");

let watchlistCache = {};

const WATCHLIST_STOCKS = [
  "INFY",
  "ONGC",
  "TCS",
  "KPITTECH",
  "QUICKHEAL",
  "WIPRO",
  "M_M",
  "RELIANCE",
  "HUL",
];

const refreshWatchlistPrices = async () => {
  console.log("Refreshing watchlist prices...");

  for (let stock of WATCHLIST_STOCKS) {
    const symbol = StockSymbolMap[stock];
    if (!symbol) continue;

    try {
      const quote = await getQuote(symbol);

      if (quote && quote.c && quote.pc) {
        const percent = (((quote.c - quote.pc) / quote.pc) * 100).toFixed(2);

        watchlistCache[stock] = {
          name: stock,
          price: quote.c,
          percent: `${percent}%`,
          isDown: quote.c < quote.pc,
        };
      }

      await new Promise((r) => setTimeout(r, 1200));
    } catch (err) {
      console.log(`Watchlist error: ${stock}`);
    }
  }

  console.log("Watchlist prices updated");
};

const getWatchlistPrices = () => {
  return Object.values(watchlistCache);
};

module.exports = {
  refreshWatchlistPrices,
  getWatchlistPrices,
};
