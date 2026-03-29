const axios = require("axios");

const FINNHUB_BASE_URL = "https://finnhub.io/api/v1";
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;


const finnhubClient = axios.create({
  baseURL: FINNHUB_BASE_URL,
  timeout: 5000,
});

const getQuote = async (symbol) => {
  const { data } = await finnhubClient.get("/quote", {
    params: {
      symbol,
      token: FINNHUB_API_KEY,
    },
  });
  return data;
};


const getMultipleQuotes = async (symbol) => {
  const results = {};
  for(const symbol of symbols) {
    results[symbol] = await getQuote(symbol);
  }
  return results;
};

module.exports = { getQuote, getMultipleQuotes };