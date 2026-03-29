const { getMultipleQuotes, getQuote } = require("../util/FinnhubClient");
const StockSymbolMap = require("../util/StockSymbolMap");
const HoldingsModel = require("../Models/HoldingsModel");
const { getWatchlistPrices } = require("../util/WatchlistPriceService");


const getMarketQuote = async (req, res) => {
  try {
    const { symbol } = req.params;
    const quote = await getQuote(symbol);
    res.json(quote);
  } catch (error) {
    res.status(500).json({ error: "Quote fetch failed" });
  }
};

const refreshHoldingsPrices = async (req, res) => {
  try {
    return res.json({
      success: true,
      message: "Prices are refreshed automatically in background",
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

const getWatchlist = async (req, res) => {
  res.json(getWatchlistPrices());
};


// const refreshHoldingsPrices = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     const holdings = await HoldingsModel.find({ userId });

//     for (let holding of holdings) {
//       const mappedSymbol = StockSymbolMap[holding.stockName];
//       if (!mappedSymbol) continue;

//       const quote = await getQuote(mappedSymbol);

//       if (quote && quote.c) {
//         holding.currentPrice = quote.c;
//         await holding.save();
//       }
//     }

//     res.json({
//       success: true,
//       message: "Holdings prices refreshed",
//     });

//   } catch (err) {
//     console.error("refreshHoldingsPrices error:", err.message);
//     res.status(500).json({
//       success: false,
//       message: "Failed to refresh holdings",
//     });
//   }
// };

module.exports = { getMarketQuote, refreshHoldingsPrices, getWatchlist };
