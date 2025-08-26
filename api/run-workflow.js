import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { repo, workflow } = req.body;

  const token = process.env.GH_TOKEN;
  const username = process.env.GH_USERNAME;
  const url = `https://api.github.com/repos/${username}/${repo}/actions/workflows/${workflow}/dispatches`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ref: 'main' })
    });

    if (response.ok) {
      res.status(200).json({ message: `Workflow triggered successfully for ${repo}` });
    } else {
      const error = await response.json();
      res.status(500).json({ error });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
