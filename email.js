document.getElementById('email-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const errorEl = document.getElementById('email-error');

  // Query NocoDB for this email
  try {
    const res = await fetch(`https://your-nocodb.com/api/v1/db/data/v1/YourProject/TestSubmissions?where=email,eq,${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'xc-token': 'your_nocodb_token'
      }
    });

    const data = await res.json();

    if (data.list && data.list.length > 0) {
      errorEl.textContent = 'You have already submitted the test.';
      return;
    }

    // Email not found — go to test
    localStorage.setItem('test_email', email);
    window.location.href = 'test.html';
  } catch (err) {
    console.error(err);
    errorEl.textContent = 'Server error. Please try again.';
  }
});
