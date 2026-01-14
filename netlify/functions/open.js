import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base(process.env.AIRTABLE_BASE_ID);

const TRANSPARENT_PIXEL = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==",
  "base64"
);

// Known email scanners / proxies
const BOT_PATTERNS = [
  "googleimageproxy",
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

  if (leadId && !isBot(userAgent)) {
    try {
      const record = await base(process.env.AIRTABLE_TABLE_NAME).find(leadId);

      // Only set if not already opened
      if (!record.get("Email Opened Date")) {
        await base(process.env.AIRTABLE_TABLE_NAME).update(leadId, {
          "Email Opened Date": new Date().toISOString(),
        });
      }

    } catch (err) {
      console.error("Open tracking failed:", err);
    }
  } else {
    console.log("Ignored bot open:", userAgent);
  }

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    },
    body: TRANSPARENT_PIXEL.toString("base64"),
    isBase64Encoded: true,
  };
}

