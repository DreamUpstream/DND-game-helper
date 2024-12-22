import axios from "axios";
import * as cheerio from "cheerio";

const ASSET_SOURCE = "https://opengameart.org";

export const fetchAssets = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Query parameter is required." });
  }

  try {
    const response = await axios.get(`${ASSET_SOURCE}/search/node/${query}`);
    const $ = cheerio.load(response.data);

    const assets = [];
    $(".search-result").each((index, element) => {
      const titleElement = $(element).find(".title a");
      const name = titleElement.text().trim();
      const pageUrl = titleElement.attr("href")
        ? `${ASSET_SOURCE}${titleElement.attr("href")}`
        : null;

      const imageUrl = $(element).find(".search-info img").attr("src");

      if (name && imageUrl) {
        assets.push({
          name,
          imageUrl: imageUrl.startsWith("http")
            ? imageUrl
            : `${ASSET_SOURCE}${imageUrl}`,
          pageUrl,
        });
      }
    });

    res.json(assets);
  } catch (error) {
    console.error("Error fetching assets:", error.message);
    res.status(500).json({ error: "Failed to fetch assets." });
  }
};
