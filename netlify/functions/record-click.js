import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base(process.env.AIRTABLE_BASE_ID);

// Delay window (ms)
const MIN_CLICK_DELAY = 5 * 60 * 1000; // 5 minutes

export async function handler(event) {
  const leadId = event.queryStringParameters?.id;

  console.log("Recording click attempt for:", leadId);

  if (!leadId) {
    return { statusCode: 400 };
  }

  try {
    const record = await base(process.env.AIRTABLE_TABLE_NAME).find(leadId);
    const sentAt = record.get("Email Sent At");

    if (!sentAt) {
      console.log("No Email Sent At — skipping delay check");
    } else {
      const sentTime = new Date(sentAt).getTime();
      const now = Date.now();

      // Ignore early scanner / prefetch clicks
      if (now - sentTime < MIN_CLICK_DELAY) {
        console.log("Ignored early click (delay window):", leadId);
        return { statusCode: 200, body: "Ignored early click" };
      }
    }

    // ALWAYS overwrite with latest real click
    await base(process.env.AIRTABLE_TABLE_NAME).update(leadId, {
      "Emailed Youtube Click Date": new Date().toISOString(),
    });

    console.log("Recorded click:", leadId);

  } catch (err) {
    console.error("Click tracking failed:", err);
  }

  return {
    statusCode: 200,
    body: "Recorded",
  };
}


