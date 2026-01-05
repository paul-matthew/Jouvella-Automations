export async function handler(event) {
  const leadId = event.queryStringParameters?.id;

  if (!leadId) {
    return { statusCode: 400 };
  }

  // Fire-and-forget so redirect is instant
  fetch("/.netlify/functions/record-click", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      leadId,
      clickedAt: new Date().toISOString()
    })
  }).catch(() => {});

  return {
    statusCode: 302,
    headers: {
      Location: "https://www.youtube.com/watch?v=zLSM5IDC_X0"
    }
  };
}




