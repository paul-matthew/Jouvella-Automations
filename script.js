async function runWorkflow(repo, workflow, inputs = {}) {
  try {
    const res = await fetch('/api/run-workflow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repo, workflow, inputs }) // pass inputs
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.message); // Success message
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

// Example for outreach button
document.querySelector('#initialEmailBtn').addEventListener('click', () => {
  runWorkflow('Jouvella-Outreach', 'run-script.yml', { type: 'outreach' });
});

document.querySelector('#replyEmailBtn').addEventListener('click', () => {
  runWorkflow('Jouvella-Outreach', 'run-script.yml', { type: 'followup' });
});


