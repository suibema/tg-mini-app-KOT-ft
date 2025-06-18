const form = document.getElementById('test-form');
const resultEl = document.getElementById('result');
const errorEl = document.getElementById('error');
const timeDisplay = document.getElementById('time-display');
const DURATION = 16 * 60; // 16 minutes in seconds
const correctAnswers = { q1: 'b', q2: 'hello' };

// Redirect if no email
const email = localStorage.getItem('test_email');
if (!email) window.location.href = 'index.html';

// Prevent re-submission
if (localStorage.getItem('test_submitted') === 'true') {
  form.style.display = 'none';
  timeDisplay.parentElement.style.display = 'none';
  resultEl.textContent = 'Test already submitted.';
}

// Save form data on input
function saveForm() {
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  localStorage.setItem('test_data', JSON.stringify(data));
}

// Restore form data
function restoreForm() {
  const saved = JSON.parse(localStorage.getItem('test_data') || '{}');
  for (const [k, v] of Object.entries(saved)) {
    if (form.elements[k]) form.elements[k].value = v;
  }
}

// Format time as MM:SS
function formatTime(seconds) {
  const min = Math.floor(seconds / 60).toString().padStart(2, '0');
  const sec = (seconds % 60).toString().padStart(2, '0');
  return `${min}:${sec}`;
}

// Timer logic
function startTimer() {
  if (!localStorage.getItem('start_time')) {
    localStorage.setItem('start_time', Date.now());
  }

  const checkInterval = setInterval(() => {
    const start = parseInt(localStorage.getItem('start_time'));
    const now = Date.now();
    const elapsed = Math.floor((now - start) / 1000);
    const remaining = Math.max(0, DURATION - elapsed);

    timeDisplay.textContent = formatTime(remaining);

    if (remaining <= 0) {
      clearInterval(checkInterval);
      timeDisplay.parentElement.style.display = 'none';
      submitForm(true);
    }
  }, 1000);
}

// Calculate score
function calculateScore(data) {
  let score = 0;
  if (data.q1 === correctAnswers.q1) score++;
  if (data.q2.trim().toLowerCase() === correctAnswers.q2) score++;
  return score;
}

// Submit form
async function submitForm(auto = false) {
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  data.email = email;

  if (!auto && (!data.q1 || !data.q2)) {
    errorEl.textContent = 'Please fill all fields.';
    return;
  }

  const score = calculateScore(data);
  console.log('Submitting', { ...data, score });

  try {
    const res = await fetch(`https://ndb.fut.ru/api/v2/tables/mg9vvteq5xw37lc/records`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
        'xc-token': 'crDte8gB-CSZzNujzSsy9obQRqZYkY3SNp8wre88'
      },
      body: JSON.stringify({
        email: data.email,
        score: score
      })
    });

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    localStorage.setItem('test_submitted', 'true');
    localStorage.removeItem('start_time');
    localStorage.removeItem('test_data');

    form.style.display = 'none';
    timeDisplay.parentElement.style.display = 'none';
    resultEl.textContent = 'Test submitted successfully.';
    errorEl.textContent = '';
  } catch (err) {
    console.error('Submission error:', err);
    errorEl.textContent = 'Failed to submit test. Please try again.';
  }
}

// Event listeners
form.addEventListener('input', saveForm);
form.addEventListener('submit', (e) => {
  e.preventDefault();
  errorEl.textContent = '';
  submitForm();
});

// Initialize
restoreForm();
startTimer();
