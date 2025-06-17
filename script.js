const form = document.getElementById('test-form');
const timerEl = document.getElementById('timer');
const resultEl = document.getElementById('result');
const DURATION = 16 * 60; // 16 minutes

const correctAnswers = {
  q1: 'b',
  q2: 'hello'
};

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
    return;
  }

  if (!localStorage.getItem('testStartTime')) {
    localStorage.setItem('testStartTime', Math.floor(Date.now() / 1000));
  }

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
  const data = Object.fromEntries(formData.entries());

  if (!data.email && !autoSubmit) {
    alert('Please enter your email.');
    return;
  }

  const score = calculateScore(data);

  // Simulated submission
  console.log('[Simulated Submit] Email:', data.email, 'Score:', score, 'AutoSubmit:', autoSubmit);

  form.style.display = 'none';
  localStorage.setItem('testSubmitted', 'true');
  localStorage.removeItem('testStartTime');

  // Optionally show a simple confirmation message (no score)
  resultEl.textContent = 'Test submitted successfully.';
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  await handleSubmit();
});

initializeTimerOnce();
