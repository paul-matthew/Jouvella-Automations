import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base(process.env.AIRTABLE_BASE_ID);

const YOUTUBE_URL = "https://www.youtube.com/watch?v=zLSM5IDC_X0";

// Known scanner / security UA fragments
const BOT_PATTERNS = [
  "google",
  "gmail",
  "outlook",
  "microsoft",
  "bing",
  "yahoo",
  "proofpoint",
  "mimecast",
  "barracuda",
  "scanner",
  "spam",
  "security"
];

// Minimum delay after send (ms)
const MIN_CLICK_DELAY = 5 * 60 * 1000; // 5 minutes

function isBot(userAgent = "") {
  const ua = userAgent.toLowerCase();
  return BOT_PATTERNS.some(p => ua.includes(p));
}

export async function handler(event) {
  const leadId = event.queryStringParameters?.id;
  const userAgent = event.headers["user-agent"] || "";

  // Always redirect — tracking must never block UX
  const redirect = {
    statusCode: 302,
    headers: { Location: YOUTUBE_URL, "Cache-Control": "no-store" },
  };

  if (!leadId) {
    return redirect;
  }

  // Ignore obvious scanners
  if (isBot(userAgent)) {
    console.log("Ignored bot click:", userAgent);
    return redirect;
  }

  try {
    const record = await base(process.env.AIRTABLE_TABLE_NAME).find(leadId);
    const sentAt = record.get("Email Sent At");

    if (!sentAt) {
      console.log("No sent date, skipping click record:", leadId);
      return redirect;
    }

    const sentTime = new Date(sentAt).getTime();
    const now = Date.now();

    // Ignore early clicks (scanner / prefetch behavior)
    if (now - sentTime < MIN_CLICK_DELAY) {
      console.log("Ignored early click (likely scanner):", leadId);
      return redirect;
    }

    // Always overwrite with most recent real click
    await base(process.env.AIRTABLE_TABLE_NAME).update(leadId, {
      "Emailed Youtube Click Date": new Date().toISOString(),
    });

    console.log("Recorded/updated REAL click:", leadId);

  } catch (err) {
    console.error("Click tracking failed:", err);
  }

  return redirect;
}




