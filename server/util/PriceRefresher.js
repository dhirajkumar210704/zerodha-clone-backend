const HoldingsModel = require("../Models/HoldingsModel");
const { getQuote } = require("./FinnhubClient");
const StockSymbolMap = require("./StockSymbolMap");

const refreshAllHoldingsPrices = async () => {
  try {
    console.log("Refreshing holdings prices...");

    const holdings = await HoldingsModel.find({});

    for (let holding of holdings) {
      const mappedSymbol = StockSymbolMap[holding.stockName];
      if (!mappedSymbol) continue;

      try {
        const quote = await getQuote(mappedSymbol);

        if (quote && quote.c) {
          holding.currentPrice = quote.c;
          await holding.save();
        }

        await new Promise(res => setTimeout(res, 1200));

      } catch (err) {
        console.error(`Quote failed for ${holding.stockName}`);
      }
    }

    console.log("Holdings prices refreshed");
  } catch (err) {
    console.error("Price refresher error:", err.message);
  }
};

module.exports = refreshAllHoldingsPrices;
