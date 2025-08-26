async function runWorkflow(repo, workflow) {
 const token = process.env.GITHUB_TOKEN;
  const username = process.env.GITHUB_USERNAME;
  const url = `https://api.github.com/repos/${username}/${repo}/actions/workflows/${workflow}/dispatches`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ref: 'main' // branch to run workflow on
      })
    });

    if (res.ok) {
      alert(`Workflow triggered successfully for ${repo}`);
    } else {
      const error = await res.json();
      console.error(error);
      alert('Error triggering workflow. Check console.');
    }
  } catch (err) {
    console.error(err);
    alert('Network or other error occurred.');
  }
}

// Wire buttons to workflows
document.querySelector('#leadBtn').addEventListener('click', () => {
  runWorkflow('Jouvella-Data-Scraper', 'run-script.yml');
});

document.querySelector('#initialEmailBtn').addEventListener('click', () => {
  runWorkflow('Jouvella-Outreach', 'run-script.yml');
});

document.querySelector('#replyEmailBtn').addEventListener('click', () => {
  runWorkflow('Jouvella-Outreach', 'run-script.yml');
});
