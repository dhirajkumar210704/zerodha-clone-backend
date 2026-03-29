const mongoose = require("mongoose");

const HoldingsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    stockName: String,
    qty: Number,
    buyPrice: Number,
    currentPrice: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Holdings" ,HoldingsSchema);