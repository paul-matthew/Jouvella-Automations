import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base(process.env.AIRTABLE_BASE_ID);

const YOUTUBE_URL = "https://www.youtube.com/watch?v=zLSM5IDC_X0";

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

function isBot(userAgent = "") {
  const ua = userAgent.toLowerCase();
  return BOT_PATTERNS.some(p => ua.includes(p));
}

export async function handler(event) {
  const leadId = event.queryStringParameters?.id;
  const userAgent = event.headers["user-agent"] || "";

  if (!leadId) {
    return {
      statusCode: 302,
      headers: { Location: YOUTUBE_URL },
    };
  }

  // Ignore scanners
  if (isBot(userAgent)) {
    console.log("Ignored bot click:", userAgent);
    return {
      statusCode: 302,
      headers: { Location: YOUTUBE_URL },
    };
  }

  console.log("Recording REAL click for:", leadId);

  try {
    const record = await base(process.env.AIRTABLE_TABLE_NAME).find(leadId);

    // Only record first real click
    if (!record.get("Emailed Youtube Click Date")) {
      await base(process.env.AIRTABLE_TABLE_NAME).update(leadId, {
        "Emailed Youtube Click Date": new Date().toISOString(),
      });
    }

  } catch (err) {
    console.error("Click tracking failed:", err);
  }

  return {
    statusCode: 302,
    headers: {
      Location: YOUTUBE_URL,
    },
  };
}



