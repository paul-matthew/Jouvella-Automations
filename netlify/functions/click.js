export async function handler(event) {
  const leadId = event.queryStringParameters?.id;

  if (!leadId) {
    return { statusCode: 400 };
  }

  try {
    await fetch(
      `${process.env.URL}/.netlify/functions/record-click?id=${leadId}`
    );
  } catch (err) {
    console.error("Click tracking failed:", err);
  }

  return {
    statusCode: 302,
    headers: {
      Location: "https://www.youtube.com/watch?v=zLSM5IDC_X0",
    },
  };
}


