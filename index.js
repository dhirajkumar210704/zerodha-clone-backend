/** @format */

require("dotenv").config();
const refreshAllHoldingsPrices = require("./server/util/PriceRefresher");
const {
  refreshWatchlistPrices,
} = require("./server/util/WatchlistPriceService");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoute = require("./server/Routes/AuthRoute");
const { verifyUser } = require("./server/Middlewares/AuthMiddleware");
const marketRoute = require("./server/Routes/MarketRoute");

const HoldingsModel = require("./server/Models/HoldingsModel");
const PositionsModel = require("./server/Models/PositionsModel");
const OrdersModel = require("./server/Models/OrdersModel");

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

const app = express();

app.use(
  cors({
    origin: [
      "https://zerodha-clone-frontend-1j7w.vercel.app",
      "https://zerodha-clone-dashboard-bv5d.vercel.app",
    ],
    credentials: true,
  }),
);

// app.use(cors({
//   origin: ["http://localhost:3000", "http://localhost:3001"],
//   credentials: true,
// }));
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());

app.use("/", authRoute);
app.use("/market", marketRoute);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/dashboard", verifyUser, (req, res) => {
  res.json({
    success: true,
    username: req.user.username,
    message: "Welcome to Dashboard",
  });
});

app.get("/holdings", verifyUser, async (req, res) => {
  try {
    const holdings = await HoldingsModel.find({
      userId: req.user._id,
    });
    res.status(200).json(holdings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/allPositions", async (req, res) => {
  let allPositions = await PositionsModel.find({});
  res.json(allPositions);
});

app.get("/orders", verifyUser, async (req, res) => {
  try {
    const orders = await OrdersModel.find({
      userId: req.user._id,
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/trade", verifyUser, async (req, res) => {
  try {
    const { stockName, qty, price, mode } = req.body;
    const userId = req.user._id;

    await OrdersModel.create({
      userId,
      stockName,
      qty,
      buyPrice: price,
      mode,
    });

    if (mode === "BUY") {
      await HoldingsModel.create({
        userId,
        stockName,
        qty,
        buyPrice: price,
        currentPrice: price,
      });
    }

    if (mode === "SELL") {
      const { holdingId } = req.body;

      const holding = await HoldingsModel.findOne({
        _id: holdingId,
        userId,
      });

      if (!holding) {
        return res.status(400).json({ message: "Holding not found" });
      }

      if (holding.qty < qty) {
        return res.status(400).json({ message: "Insufficient quantity" });
      }

      holding.qty -= qty;
      if (holding.qty === 0) {
        await HoldingsModel.deleteOne({ _id: holdingId });
      } else {
        await holding.save();
      }
    }

    res.json({ success: true, message: "Trade successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Trade failed" });
  }
});

mongoose
  .connect(uri)
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server running & DB connected");
    });
  })
  .catch((err) => console.log(err));

// All holdings price refresh
setInterval(
  () => {
    refreshAllHoldingsPrices();
  },
  2 * 60 * 1000,
);

// Watchlist price refresh
setInterval(
  () => {
    refreshWatchlistPrices();
  },
  2 * 60 * 1000,
);
