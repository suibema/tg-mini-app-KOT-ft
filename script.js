const form = document.getElementById('test-form');
const timerEl = document.getElementById('timer');
const resultEl = document.getElementById('result');
const DURATION = 16 * 60; // 16 minutes
let timeLeft = DURATION;
let timerStarted = false;

// Correct answers:
const correctAnswers = {
  q1: 'b',
  q2: 'hello'
};

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function startTimer() {
  timerEl.textContent = `Time left: ${formatTime(timeLeft)}`;
  const interval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `Time left: ${formatTime(timeLeft)}`;

    if (timeLeft <= 0) {
      clearInterval(interval);
      handleSubmit(true);
    }
  }, 1000);
}

function calculateScore(data) {
  let score = 0;
  if (data.q1 === correctAnswers.q1) score++;
  if (data.q2.trim().toLowerCase() === correctAnswers.q2) score++;
  return score;
}

async function sendTconst form = document.getElementById('test-form');
const timerEl = document.getElementById('timer');
const resultEl = document.getElementById('result');
const DURATION = 16 * 60; // 16 minutes in seconds

// Correct answers
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
    localStorage.setItem('testStartTime', Math.floor(Date.now() / 1000)); // current UNIX time
  }
  startTimer();
}

function calculateScore(data) {
  let score = 0;
  if (data.q1 === correctAnswers.q1) score++;
  if (data.q2.trim().toLowerCase() === correctAnswers.q2) score++;
  return score;
}

async function sendToNocoDB(data) {
  const url = 'https://<your-nocodb-url>'; // replace
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'xc-auth': '<your-api-key>' // replace
    },
    body: JSON.stringify(data)
  });
  return res.ok;
}

async function handleSubmit(autoSubmit = false) {
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  const score = calculateScore(data);

  const dump = {
    email: data.email,
    score: score,
    autoSubmit: autoSubmit
  };

  await sendToNocoDB(dump);
  resultEl.textContent = `Submitted. Score: ${score}/2`;
  form.style.display = 'none';

  // prevent re-submission after reload
  localStorage.removeItem('testStartTime');
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  await handleSubmit();
});

initializeTimerOnce();
oNocoDB(data) {
  const url = 'https://<your-nocodb-domain>/api/v1/db/data/noco/<project>/<table>'; // ← replace this
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'xc-auth': '<your-api-key>' // replace with NocoDB API key
    },
    body: JSON.stringify(data)
  });
  return res.ok;
}

async function handleSubmit(autoSubmit = false) {
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  const score = calculateScore(data);

  const dump = {
    email: data.email,
    score: score,
    timeLeft: timeLeft,
    autoSubmit: autoSubmit
  };

  await sendToNocoDB(dump);
  resultEl.textContent = `Submitted. Score: ${score}/2`;
  form.style.display = 'none';
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  await handleSubmit();
});

if (!timerStarted) {
  startTimer();
  timerStarted = true;
}
