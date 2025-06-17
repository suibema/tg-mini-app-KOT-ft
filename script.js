const form = document.getElementById('test-form');
const timerEl = document.getElementById('timer');
const resultEl = document.getElementById('result');
const DURATION = 16 * 60; // 16 minutes

const correctAnswers = {
  q1: 'b',
  q2: 'hello'
};

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
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
    timerEl.textContent = `Time left: ${formatTime(timeLeft)}`;

    if (timeLeft <= 0) {
      clearInterval(interval);
      handleSubmit(true);
    }
  }, 1000);
}

function initializeTimerOnce() {
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

  if (!data.email) {
    alert('Please enter your email.');
    return;
  }

  const score = calculateScore(data);

  // Normally, you'd send this to NocoDB here:
  // await sendToNocoDB({ email: data.email, score: score, autoSubmit });

  console.log('[Simulated Submit] Email:', data.email, 'Score:', score, 'AutoSubmit:', autoSubmit);
  resultEl.textContent = `Test submitted`;
  form.style.display = 'none';
  localStorage.removeItem('testStartTime');
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  await handleSubmit();
});

initializeTimerOnce();
