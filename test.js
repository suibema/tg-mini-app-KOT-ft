  <script>
    const token = 'crDte8gB-CSZzNujzSsy9obQRqZYkY3SNp8wre88e';

    // 16 minutes
    const MAX_TIME = 16 * 60 * 1000;

    const q1 = document.getElementById('q1');
    const q2 = document.getElementById('q2');
    const email = localStorage.getItem('test_email');

    if (!email) window.location.href = 'email.html';

    // Restore answers
    q1.value = localStorage.getItem('q1') || '';
    q2.value = localStorage.getItem('q2') || '';

    q1.addEventListener('input', () => localStorage.setItem('q1', q1.value));
    q2.addEventListener('change', () => localStorage.setItem('q2', q2.value));

    // ⏱ Start or resume timer
    let startTime = localStorage.getItem('test_start_time');
    if (!startTime) {
      startTime = Date.now();
      localStorage.setItem('test_start_time', startTime);
    } else {
      startTime = parseInt(startTime);
    }

    const timeLeftEl = document.getElementById('time-left');
    const submitBtn = document.getElementById('submit-btn');

    const updateTimer = () => {
      const elapsed = Date.now() - startTime;
      const remaining = MAX_TIME - elapsed;

      if (remaining <= 0) {
        timeLeftEl.textContent = '⏰ Time is up. Test locked.';
        submitBtn.disabled = true;
        q1.disabled = true;
        q2.disabled = true;
        return;
      }

      const mins = Math.floor(remaining / 60000);
      const secs = Math.floor((remaining % 60000) / 1000);
      timeLeftEl.textContent = `Time left: ${mins}:${secs.toString().padStart(2, '0')}`;
      requestAnimationFrame(updateTimer);
    };

    updateTimer(); // start the timer loop

    // ✅ Submit logic
    document.getElementById('test-form').addEventListener('submit', async (e) => {
      e.preventDefault();

      const elapsed = Date.now() - startTime;
      if (elapsed > MAX_TIME) {
        document.getElementById('status').textContent = 'Too late! Time expired.';
        return;
      }

      const answers = {
        email: email,
        score: (q1.value.toLowerCase() === 'correct' && q2.value === 'A') ? 2 : 0
      };

      try {
        const res = await fetch('https://ndb.fut.ru/api/v2/tables/mg9vvteq5xw37lc/records', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'xc-token': token
          },
          body: JSON.stringify({ data: answers })
        });

        if (res.ok) {
          localStorage.clear();
          document.getElementById('status').textContent = 'Test submitted successfully!';
          document.getElementById('test-form').reset();
        } else {
          throw new Error('Submission failed');
        }
      } catch (err) {
        console.error(err);
        document.getElementById('status').textContent = 'Failed to submit test.';
      }
    });
  </script>
</body>
</html>
