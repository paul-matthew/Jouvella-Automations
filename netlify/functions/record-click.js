import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base(process.env.AIRTABLE_BASE_ID);

export async function handler(event) {
  const leadId = event.queryStringParameters?.id;

  console.log("Recording click for:", leadId);

  if (!leadId) {
    return { statusCode: 400 };
  }

  await base(process.env.AIRTABLE_TABLE_NAME).update(leadId, {
    "Emailed Youtube Click Date": new Date().toISOString(),
  });

  return {
    statusCode: 200,
    body: "Recorded",
  };
}

