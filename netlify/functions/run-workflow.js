import fetch from 'node-fetch';

export async function handler(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid JSON' }),
    };
  }

  const { repo, workflow, inputs } = body;

  const token = process.env.GH_TOKEN;
  const username = process.env.GH_USERNAME;

  if (!token || !username) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'GH_TOKEN or GH_USERNAME missing in environment' }),
    };
  }

  const url = `https://api.github.com/repos/${username}/${repo}/actions/workflows/${workflow}/dispatches`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ref: 'main',
        inputs: inputs || {},
      }),
    });

    const text = await response.text();

    if (response.ok) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: `Workflow triggered successfully for ${repo}` }),
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: text }),
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}

