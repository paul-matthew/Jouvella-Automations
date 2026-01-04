document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('loginOverlay');
  const loginBtn = document.getElementById('loginBtn');
  const errorMsg = document.getElementById('loginError');
  const togglePassword = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');

  const correctUsername = 'JouvellaAdmin';
  const correctPassword = 'mypassword';

  // Workflow buttons
  const workflowButtons = [
    // document.getElementById('leadBtn'),
    document.getElementById('initialEmailBtn'),
    document.getElementById('replyEmailBtn'),
    document.getElementById('replyEmailBtn2')
  ];

  // Login button
function handleLogin() {
  const username = document.getElementById('username').value;
  const password = passwordInput.value;

  if (username === correctUsername && password === correctPassword) {
    overlay.style.display = 'none';
    errorMsg.style.display = 'none';
    // Enable workflow buttons
    workflowButtons.forEach(btn => btn.disabled = false);
  } else {
    errorMsg.style.display = 'block';
  }
}

loginBtn.addEventListener('click', handleLogin);

// Allow pressing Enter key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    handleLogin();
  }
});

  // Eye toggle
  togglePassword.addEventListener('click', () => {
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      togglePassword.src = 'eye-open.svg';
    } else {
      passwordInput.type = 'password';
      togglePassword.src = 'eye-closed.svg';
    }
  });
});





async function runWorkflow(repo, workflow, inputs = {}) {
  try {
    // const res = await fetch('/api/run-workflow', {
    const res = await fetch('https://jouvella-automations.netlify.app/.netlify/functions/run-workflow', {
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
// document.querySelector('#leadBtn').addEventListener('click', () => {
//   runWorkflow('Jouvella-Data-Scraper', 'run-script.yml');
// });

// Example for outreach button
document.querySelector('#initialEmailBtn').addEventListener('click', () => {
  runWorkflow('Jouvella-Outreach', 'run-script.yml', { type: 'outreach' });
});

document.querySelector('#replyEmailBtn').addEventListener('click', () => {
  runWorkflow('Jouvella-Outreach', 'run-script.yml', { type: 'followup' });
});

document.querySelector('#replyEmailBtn2').addEventListener('click', () => {
  runWorkflow('Jouvella-Outreach', 'run-script.yml', { type: 'followup2' });
});


