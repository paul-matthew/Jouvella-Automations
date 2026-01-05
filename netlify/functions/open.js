import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base(process.env.AIRTABLE_BASE_ID);

const TRANSPARENT_PIXEL = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==",
  "base64"
);

export async function handler(event) {
  const leadId = event.queryStringParameters?.id;

  if (leadId) {
    try {
      await base(process.env.AIRTABLE_TABLE_NAME).update(leadId, {
        "Email Opened Date": new Date(),
      });
    } catch (err) {
      console.error("Open tracking failed:", err);
    }
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
