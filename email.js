document.getElementById('email-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const errorEl = document.getElementById('email-error');

  // Check with backend if already submitted
  try {
    const res = await fetch('https://your-backend.com/check-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    const result = await res.json();

    if (result.alreadySubmitted) {
      errorEl.textContent = 'You have already submitted the test.';
      return;
    }

    // Store email and go to test
    localStorage.setItem('test_email', email);
    window.location.href = 'test.html';
  } catch (err) {
    errorEl.textContent = 'Server error. Please try again.';
  }
});
