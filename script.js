const form = document.getElementById('test-form');
const resultEl = document.getElementById('result');
const DURATION = 16 * 60; // 16 minutes

const correctAnswers = {
  q1: 'b',
  q2: 'hello'
};

function saveFormData() {
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  localStorage.setItem('testFormData', JSON.stringify(data));
}

function restoreFormData() {
  const saved = localStorage.getItem('testFormData');
  if (saved) {
    const data = JSON.parse(saved);
    for (const [key, value] of Object.entries(data)) {
      const field = form.elements[key];
      if (field) field.value = value;
    }
  }
}

function getTimeLeft() {
  const start = parseInt(localStorage.getItem('testStartTime'), 10);
  const now = Math.floor(Date.now() / 1000);
  const elapsed = now - start;
  return Math.max(DURATION - elapsed, 0);
}

function startTimer() {
  let timeLeft = getTimeLeft();

  const interval = setInterval(() => {
    timeLeft = getTimeLeft();

    if (timeLeft <= 0) {
      clearInterval(interval);
      handleSubmit(true);
    }
  }, 1000);
}

function initializeTimerOnce() {
  if (localStorage.getItem('testSubmitted') === 'true') {
    form.style.display = 'none';
    resultEl.textContent = 'Test already submitted.';
    return;
  }

  if (!localStorage.getItem('testStartTime')) {
    localStorage.setItem('testStartTime', Math.floor(Date.now() / 1000));
  }

  restoreFormData();
  startTimer();
}

function calculateScore(data) {
  let score = 0;
  if (data.q1 === correctAnswers.q1) score++;
  if (data.q2.trim().toLowerCase() === correctAnswers.q2) score++;
  return score;
}

async function handleSubmit(autoSubmit = false) {
  const formData = new FormData(form);
  let data = Object.fromEntries(formData.entries());

  // Try to recover saved form data if needed
  if (!data.email && autoSubmit) {
    const saved = localStorage.getItem('testFormData');
    if (saved) {
      data = JSON.parse(saved);
    }
  }

  if (!data.email) {
    if (!autoSubmit) alert('Please enter your email.');
    return;
  }

  const score = calculateScore(data);

  console.log('[Submit]', data.email, 'Score:', score, 'Auto:', autoSubmit);

  form.style.display = 'none';
  localStorage.setItem('testSubmitted', 'true');
  localStorage.removeItem('testStartTime');
  localStorage.removeItem('testFormData');

  resultEl.textContent = 'Test submitted successfully.';
}

// Save input changes live
form.addEventListener('input', saveFormData);

// Submit on click
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  await handleSubmit();
});

initializeTimerOnce();
