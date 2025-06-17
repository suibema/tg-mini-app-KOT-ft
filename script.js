const form = document.getElementById('test-form');
const resultEl = document.getElementById('result');
const DURATION = 16 * 60; // 16 minutes

const correctAnswers = {
  q1: 'b',
  q2: 'hello'
};

// --- Safe storage functions (sessionStorage first, fallback to localStorage) ---
function safeStorageSet(key, value) {
  try {
    sessionStorage.setItem(key, value);
  } catch (e) {
    localStorage.setItem(key, value);
  }
}

function safeStorageGet(key) {
  try {
    return sessionStorage.getItem(key) || localStorage.getItem(key);
  } catch (e) {
    return localStorage.getItem(key);
  }
}

function safeStorageRemove(key) {
  try {
    sessionStorage.removeItem(key);
  } catch (e) {}
  localStorage.removeItem(key);
}

// --- Save and restore form input ---
function saveFormData() {
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  safeStorageSet('testFormData', JSON.stringify(data));
}

function restoreFormData() {
  const saved = safeStorageGet('testFormData');
  if (saved) {
    const data = JSON.parse(saved);
    for (const [key, value] of Object.entries(data)) {
      const field = form.elements[key];
      if (field) field.value = value;
    }
  }
}

// --- Timer logic ---
function getTimeLeft() {
  const start = parseInt(safeStorageGet('testStartTime'), 10);
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
  if (safeStorageGet('testSubmitted') === 'true') {
    form.style.display = 'none';
    resultEl.textContent = 'Test already submitted.';
    return;
  }

  if (!safeStorageGet('testStartTime')) {
    safeStorageSet('testStartTime', Math.floor(Date.now() / 1000));
  }

  restoreFormData();
  startTimer();
}

// --- Score checking ---
function calculateScore(data) {
  let score = 0;
  if (data.q1 === correctAnswers.q1) score++;
  if (data.q2.trim().toLowerCase() === correctAnswers.q2) score++;
  return score;
}

// --- Submit handler ---
async function handleSubmit(autoSubmit = false) {
  const formData = new FormData(form);
  let data = Object.fromEntries(formData.entries());

  // Try to recover saved form data if needed
  if ((!data.email || data.email.trim() === '') && autoSubmit) {
    const saved = safeStorageGet('testFormData');
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
  resultEl.textContent = 'Test submitted successfully.';
  safeStorageSet('testSubmitted', 'true');
  safeStorageRemove('testStartTime');
  safeStorageRemove('testFormData');
}

// --- Event listeners ---
form.addEventListener('input', saveFormData);
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  await handleSubmit();
});

initializeTimerOnce();
