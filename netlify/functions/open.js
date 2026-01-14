import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base(process.env.AIRTABLE_BASE_ID);

const TRANSPARENT_PIXEL = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==",
  "base64"
);

// Ignore anything earlier than this (ms)
const MIN_OPEN_DELAY = 3 * 60 * 1000; // 3 minutes

export async function handler(event) {
  const leadId = event.queryStringParameters?.id;
  const userAgent = event.headers["user-agent"] || "";

  if (!leadId) {
    return pixel();
  }

  try {
    const record = await base(process.env.AIRTABLE_TABLE_NAME).find(leadId);
    const sentAt = record.get("Email Sent At");

    if (!sentAt) {
      return pixel();
    }

    const sentTime = new Date(sentAt).getTime();
    const now = Date.now();

    // Ignore provider prefetch / immediate scans
    if (now - sentTime < MIN_OPEN_DELAY) {
      console.log("Ignored early open (likely provider scan)");
      return pixel();
    }

    // Always overwrite after delay (real human behavior)
    await base(process.env.AIRTABLE_TABLE_NAME).update(leadId, {
      "Email Opened Date": new Date().toISOString(),
    });

    console.log("Recorded/updated open:", leadId);

  } catch (err) {
    console.error("Open tracking failed:", err);
  }

  return pixel();
}

function pixel() {
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


