const HoldingsModel = require("../Models/HoldingsModel");

const defaultHoldings = [
  { stockName: "INFY", qty: 10, buyPrice: 1500 },
  { stockName: "TCS", qty: 5, buyPrice: 3200 },
  { stockName: "RELIANCE", qty: 8, buyPrice: 2500 },
];

module.exports.SeedHoldingsForUser = async (userId) => {
  const holdings = defaultHoldings.map(h => ({
    userId,
    ...h,
    currentPrice: h.buyPrice,
  }));

  await HoldingsModel.insertMany(holdings);
};