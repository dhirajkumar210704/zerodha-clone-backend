const router = require("express").Router();
const { verifyUser } = require("../Middlewares/AuthMiddleware");
const {
  getMarketQuote,
  refreshHoldingsPrices,
  getWatchlist
} = require("../Controllers/MarketController");

router.get("/quote/:symbol", getMarketQuote);

router.get("/refresh-holdings", verifyUser, refreshHoldingsPrices);

router.get("/watchlist", getWatchlist);

module.exports = router;
