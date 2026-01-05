import Airtable from "airtable";

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_ID);

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405 };
  }

  const { leadId, clickedAt } = JSON.parse(event.body);

  if (!leadId) {
    return { statusCode: 400 };
  }

  const table = base(process.env.AIRTABLE_TABLE_NAME);

  const record = await table.find(leadId);

  // Only write first click
  if (!record.fields["Emailed Youtube Click Date"]) {
    await table.update(leadId, {
      "Emailed Youtube Click Date": clickedAt
    });
  }

  return { statusCode: 200 };
}

