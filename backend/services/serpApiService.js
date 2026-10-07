const { getJson } = require("serpapi");

async function searchScholarships(query) {
  const results = await getJson({
    engine: "google",
    q: query,
    api_key: process.env.SERPAPI_KEY
  });

  return results.organic_results || [];
}

module.exports = {
  searchScholarships
};