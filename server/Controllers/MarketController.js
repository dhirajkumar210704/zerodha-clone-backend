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

module.exports = { getMarketQuote, refreshHoldingsPrices, getWatchlist };
