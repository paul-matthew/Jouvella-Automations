async function runWorkflow(repo, workflow) {
  try {
    const res = await fetch('/api/run-workflow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repo, workflow })
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.message); // Success message from serverless function
    } else {
      console.error(data.error);
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

