const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

app.get("/api/fantasypros", async (req, res) => {
  try {
    const { data } = await axios.get("https://www.fantasypros.com/nfl/trade-values/dynasty-overall.php");
    const $ = cheerio.load(data);
    const players = {};

    $("table#trade-values tbody tr").each((_, el) => {
      const name = $(el).find("td:nth-child(2)").text().trim();
      const value = parseFloat($(el).find("td:nth-child(3)").text());
      if (name && !isNaN(value)) {
        players[name.toLowerCase()] = value;
      }
    });

    res.json(players);
  } catch (err) {
    console.error("Scraping error:", err.message);
    res.status(500).json({ error: "Failed to fetch FantasyPros data" });
  }
});

app.listen(PORT, () => {
  console.log(`🟢 Server running at http://localhost:${PORT}`);
});