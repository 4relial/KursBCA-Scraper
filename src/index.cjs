const cheerio = require("cheerio");

const BCA_URL = "https://www.bca.co.id/en/informasi/kurs";

function convertToISODate(dateStr) {
  try {
    if (!dateStr) return "";
    const cleaned = dateStr.replace(/\s+/g, " ").trim();
    const m = cleaned.match(/(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})\s*\/\s*(\d{1,2}):(\d{2})/);
    if (!m) return "";

    const [, day, mon, year, hour, minute] = m;
    const months = {
      Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
      Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12",
    };
    const monthNum = months[mon];
    if (!monthNum) return "";

    const d = String(day).padStart(2, "0");
    const h = String(hour).padStart(2, "0");
    const min = String(minute).padStart(2, "0");
    return `${year}-${monthNum}-${d}T${h}:${min}:00+07:00`;
  } catch {
    return "";
  }
}

function parseNumber(s = "") {
  const n = String(s).replace(/[^0-9.]/g, "");
  const f = parseFloat(n);
  return Number.isFinite(f) ? f : 0;
}

async function kursBCA() {
  try {
    const response = await fetch(BCA_URL, {
      headers: {
        "User-Agent": "kursbca-lib/1.0 (unofficial)",
        "Accept-Language": "en-US,en;q=0.9,id;q=0.8"
      }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const html = await response.text();

    const $ = cheerio.load(html);
    const eRateDateText = $("thead .a-header-rate .a-text-micro").first().text().trim();
    const isoDate = convertToISODate(eRateDateText);

    const rates = [];
    $("table.m-table-kurs tbody tr.m-table-body-row").each((_, el) => {
      const row = $(el);
      const currency = row.attr("code")?.trim() || "";

      const buyText = row.find('td.rate-column[rate-type="eRate-buy"] > p').first().text();
      const sellText = row.find('td.rate-column[rate-type="eRate-sell"] > p').first().text();

      const buy = parseNumber(buyText);
      const sell = parseNumber(sellText);

      if (currency && (buy > 0 || sell > 0)) {
        rates.push({ mts: currency, buy, sell, date: isoDate || null });
      }
    });

    return { date: isoDate || null, data: rates };
  } catch (error) {
    console.error("Failed to scrape BCA rates:", error);
    return { date: null, data: [] };
  }
}

module.exports = { kursBCA, default: kursBCA, convertToISODate, parseNumber };
