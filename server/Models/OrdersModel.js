const mongoose = require("mongoose");

const OrdersSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    stockName: String,
    qty: Number,
    buyPrice: Number,
    mode: {
      type: String,
      enum: ["BUY", "SELL"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Orders" ,OrdersSchema);