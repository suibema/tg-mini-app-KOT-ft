document.getElementById('email-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const errorEl = document.getElementById('email-error');

  try {
    const find_email = await fetch(`https://ndb.fut.ru/api/v2/tables/maiff22q0tefj6t/records/count?where=(E-mail,eq,${encodeURIComponent(email)})`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'xc-token': 'crDte8gB-CSZzNujzSsy9obQRqZYkY3SNp8wre88'
      }
    });

    const data_found_email = await find_email.json();

    if (data_found_email.count === 0) {
      errorEl.textContent = 'You have not submitted the reg.';
      return;
    }

    const res = await fetch(`https://ndb.fut.ru/api/v2/tables/maiff22q0tefj6t/records/count?where=(E-mail,eq,${encodeURIComponent(email)}),(Результат КОТ,neq,'')`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'xc-token': 'crDte8gB-CSZzNujzSsy9obQRqZYkY3SNp8wre88'
      }
    });

    const data = await res.json();

    if (data.count > 0) {
      errorEl.textContent = 'You have already submitted the test.';
      return;
    }

    localStorage.setItem('test_email', email);
    window.location.href = 'test.html';
  } catch (err) {
    console.error(err);
    errorEl.textContent = 'Server error. Please try again.';
  }
});
