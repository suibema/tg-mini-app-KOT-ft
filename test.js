const form = document.getElementById('test-form');
const resultEl = document.getElementById('result');
const DURATION = 16 * 60;
const correctAnswers = { q1: 'b', q2: 'hello' };

// Start time and email
const email = localStorage.getItem('test_email');
if (!email) window.location.href = 'index.html';

if (localStorage.getItem('test_submitted') === 'true') {
  form.style.display = 'none';
  resultEl.textContent = 'Test already submitted.';
}

function saveForm() {
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  localStorage.setItem('test_data', JSON.stringify(data));
}

function restoreForm() {
  const saved = JSON.parse(localStorage.getItem('test_data') || '{}');
  for (const [k, v] of Object.entries(saved)) {
    if (form.elements[k]) form.elements[k].value = v;
  }
}

function startTimer() {
  if (!localStorage.getItem('start_time')) {
    localStorage.setItem('start_time', Date.now());
  }

  const checkInterval = setInterval(() => {
    const start = parseInt(localStorage.getItem('start_time'));
    const now = Date.now();
    const elapsed = Math.floor((now - start) / 1000);

    if (elapsed >= DURATION) {
      clearInterval(checkInterval);
      submitForm(true);
    }
  }, 1000);
}

function calculateScore(data) {
  let score = 0;
  if (data.q1 === correctAnswers.q1) score++;
  if (data.q2.trim().toLowerCase() === correctAnswers.q2) score++;
  return score;
}

async function submitForm(auto = false) {
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  data.email = email;

  if (!data.q1 || !data.q2) {
    if (!auto) alert('Fill all fields');
    return;
  }

  const score = calculateScore(data);
  console.log('Submitting', { ...data, score });

  // Replace this with your actual backend call to NocoDB later
  /*
  await fetch('https://your-backend.com/submit', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ ...data, score })
  });
  */

  localStorage.setItem('test_submitted', 'true');
  localStorage.removeItem('start_time');
  localStorage.removeItem('test_data');

  form.style.display = 'none';
  resultEl.textContent = 'Test submitted successfully.';
}

form.addEventListener('input', saveForm);
form.addEventListener('submit', (e) => {
  e.preventDefault();
  submitForm();
});

restoreForm();
startTimer();
